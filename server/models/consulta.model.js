/**
 * @class ConsultaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de consultas.
 */
class ConsultaModel {
	/**
	 * @method findAll
	 * @description Método para obtener todas las consultas con paginación.
	 * @static
	 * @async
	 * @memberof ConsultaModel
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que contiene las consultas, el total de consultas, la página actual y el total de páginas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findAll(searchValues, dbConn) {
		const page = searchValues.page;
		const limit = searchValues.limit;
		const search = searchValues.search;

		const offset = (page - 1) * limit;

		let query =
			'SELECT ' +
			'   consulta.id, ' +
			'   consulta.nombre, ' +
			'   especialidad.id AS especialidad_id, ' +
			'   especialidad.nombre AS nombre_especialidad, ' +
			'   usuario.id AS especialista_id,' +
			'   usuario.nombre AS nombre_usuario, ' +
			'   usuario.primer_apellido, ' +
			'   usuario.segundo_apellido ' +
			'FROM ' +
			'   consulta ' +
			'LEFT JOIN ' +
			'   especialista ON consulta.id = especialista.consulta_id ' +
			'LEFT JOIN ' +
			'   usuario ON especialista.usuario_id = usuario.id ' +
			'LEFT JOIN ' +
			'   especialidad ON especialista.especialidad_id = especialidad.id ';

		let countQuery =
			'SELECT ' +
			'   COUNT(*) AS count ' +
			'FROM ' +
			'   consulta ';

		const queryParams = [];
		const countParams = [];

		if (search) {
			query += ' WHERE ' +
				'   consulta.nombre LIKE ? ';
			countQuery += ' WHERE ' +
				'   consulta.nombre LIKE ? ';
			queryParams.push(`%${search}%`);
			countParams.push(`%${search}%`);
		}

		query +=
			'ORDER BY ' +
			'   consulta.id ASC ' +
			'LIMIT ? OFFSET ?';

		queryParams.push(`${limit}`, `${offset}`);

		try {
			const [rows] = await dbConn.execute(query, queryParams);
			const [count] = await dbConn.execute(countQuery, countParams);
			const total = count[0].count;
			const actualPage = page;
			const totalPages = Math.ceil(total / limit);

			const consultas = {};
			rows.forEach((row) => {
				if (!consultas[row.id]) {
					consultas[row.id] = {
						id: row.id,
						nombre: row.nombre,
						medicos_asociados: [],
					};
				}

				if (row.nombre_usuario) {
					consultas[row.id].medicos_asociados.push({
						id: row.especialista_id,
						datos_personales: {
							nombre: row.nombre_usuario,
							primer_apellido: row.primer_apellido,
							segundo_apellido: row.segundo_apellido,
						},
						datos_especialidad: {
							id: row.especialidad_id,
							nombre: row.nombre_especialidad,
						},
					});
				}
			});

			return { rows: Object.values(consultas), total, actualPage, totalPages };
		} catch (err) {
			throw new Error('Error al obtener las consultas.');
		}
	}

	/**
	 * @method findAllListado
	 * @description Método para obtener todas las consultas.
	 * @static
	 * @async
	 * @memberof ConsultaModel
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de consultas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findAllListado(dbConn) {
		const query =
			'SELECT ' +
			'		id, ' +
			'		nombre ' +
			'FROM ' +
			'		consulta ' +
			'ORDER BY ' +
			'		id ASC';

		try {
			const [rows] = await dbConn.execute(query);

			if (!rows) {
				return null;
			}

			return rows;
		} catch (err) {
			throw new Error('Error al obtener las consultas.');
		}
	}

	/**
	 * @method findById
	 * @description Método para obtener una consulta por su ID.
	 * @static
	 * @async
	 * @memberof ConsultaModel
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La consulta.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findById(id, dbConn) {
		const query =
			'SELECT ' +
			'   consulta.id, ' +
			'   consulta.nombre, ' +
			'   especialidad.id AS especialidad_id, ' +
			'   especialidad.nombre AS nombre_especialidad, ' +
			'   usuario.id AS especialista_id,' +
			'   usuario.nombre AS nombre_usuario, ' +
			'   usuario.primer_apellido, ' +
			'   usuario.segundo_apellido ' +
			'FROM ' +
			'   consulta ' +
			'LEFT JOIN ' +
			'   especialista ON consulta.id = especialista.consulta_id ' +
			'LEFT JOIN ' +
			'   usuario ON especialista.usuario_id = usuario.id ' +
			'LEFT JOIN ' +
			'   especialidad ON especialista.especialidad_id = especialidad.id ' +
			'WHERE ' +
			'   consulta.id = ?';

		try {
			const [rows] = await dbConn.execute(query, [id]);

			if (!rows.length) {
				return null;
			}

			const consulta = {
				id: rows[0].id,
				nombre: rows[0].nombre,
				medicos_asociados: [],
			};

			rows.forEach((row) => {
				if (row.especialista_id && row.nombre_usuario) {
					consulta.medicos_asociados.push({
						id: row.especialista_id,
						nombre: row.nombre_usuario,
						primer_apellido: row.primer_apellido,
						segundo_apellido: row.segundo_apellido,
						datos_especialidad: {
							id: row.especialidad_id,
							nombre: row.nombre_especialidad,
						},
					});
				}
			});

			return consulta;
		} catch (err) {
			throw new Error('Error al obtener la consulta.');
		}
	}

	/**
	 * @method findByName
	 * @description Método para obtener una consulta por su nombre.
	 * @static
	 * @async
	 * @memberof ConsultaModel
	 * @param {string} nombre - El nombre de la consulta.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La consulta.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findByName(nombre, dbConn) {
		const query = 'SELECT id FROM consulta WHERE nombre = ?';

		try {
			const [rows] = await dbConn.execute(query, [nombre]);

			if (!rows.length) {
				return null;
			}

			return rows[0];
		} catch (err) {
			throw new Error('Error al obtener la consulta.');
		}
	}

	/**
	 * @method createConsulta
	 * @description Método para crear una nueva consulta.
	 * @static
	 * @async
	 * @memberof ConsultaModel
	 * @param {Object} consulta - El objeto de la nueva consulta.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva consulta creada.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createConsulta(consulta, dbConn) {
		const nombre = consulta.nombre;

		const query = 'INSERT INTO consulta (nombre) VALUES (?)';

		try {
			return await dbConn.execute(query, [nombre]);
		} catch (err) {
			throw new Error('Error al crear la consulta.');
		}
	}

	/**
	 * @method updateConsulta
	 * @description Método para actualizar una consulta por su ID.
	 * @static
	 * @async
	 * @memberof ConsultaModel
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} consulta - El objeto de la consulta con los datos actualizados.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La consulta actualizada.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateConsulta(id, consulta, dbConn) {
		const nombre = consulta.nombre;

		const query = 'UPDATE consulta SET nombre = ? WHERE id = ?';

		try {
			return await dbConn.execute(query, [nombre, id]);
		} catch (err) {
			throw new Error('Error al actualizar la consulta.');
		}
	}

	/**
	 * @method deleteConsulta
	 * @description Método para eliminar una consulta por su ID.
	 * @static
	 * @async
	 * @memberof ConsultaModel
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<void>} No retorna nada si la operación es exitosa.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteConsulta(id, dbConn) {
		const query = 'DELETE FROM consulta WHERE id = ?';

		try {
			return await dbConn.execute(query, [id]);
		} catch (err) {
			throw new Error('Error al eliminar la consulta.');
		}
	}
}

// Exportación del modelo
export default ConsultaModel;
