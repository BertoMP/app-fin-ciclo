/**
 * @class MedicamentoModel
 * @description Clase que contiene los métodos para interactuar con la tabla de medicamentos.
 */
class MedicamentoModel {
	/**
	 * @method fetchAllPrescripcion
	 * @description Método para obtener todos los medicamentos ordenados por nombre.
	 * @static
	 * @async
	 * @memberof MedicamentoModel
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de medicamentos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAllPrescripcion(dbConn) {
		const query =
			'SELECT ' +
			'   id, ' +
			'   nombre ' +
			'FROM ' +
			'   medicamento ' +
			'ORDER BY ' +
			'   nombre ASC';

		try {
			const [rows] = await dbConn.execute(query);
			return rows;
		} catch (err) {
			throw new Error('Error al obtener los medicamentos.');
		}
	}

	/**
	 * @method fetchAll
	 * @description Método para obtener todos los medicamentos con paginación.
	 * @static
	 * @async
	 * @memberof MedicamentoModel
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto con los medicamentos, el total de medicamentos, la página actual y el total de páginas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(searchValues, dbConn) {
		const page = searchValues.page;
		const limit = searchValues.limit;
		const search = searchValues.search;

		const offset = (page - 1) * limit;

		let query =
			'SELECT ' +
			'   id, ' +
			'   nombre, ' +
			'   descripcion ' +
			'FROM ' +
			'   medicamento ';

		let countQuery =
			'SELECT ' +
			'		COUNT(*) AS count ' +
			'FROM ' +
			'		medicamento ';

		let queryParams = [];
		let countParams = [];

		if (search) {
			query += 'WHERE nombre LIKE ? ';
			countQuery += 'WHERE nombre LIKE ? ';
			queryParams.push(`%${search}%`);
			countParams.push(`%${search}%`);
		}

		query +=
			'ORDER BY ' +
			'		nombre ASC ' +
			'LIMIT ? OFFSET ?';

		queryParams.push(`${limit}`, `${offset}`);

		try {
			const [rows] = await dbConn.execute(query, queryParams);
			const [count] = await dbConn.execute(countQuery, countParams);
			const total = count[0].count;
			const actualPage = page;
			const totalPages = Math.ceil(total / limit);

			const formattedRows = rows.map((row) => {
				return {
					id: row.id,
					datos_medicamento: {
						nombre: row.nombre,
						descripcion: row.descripcion,
					}
				}
			});

			return { formattedRows, total, actualPage, totalPages };
		} catch (err) {
			throw new Error('Error al obtener los medicamentos.');
		}
	}

	/**
	 * @method findById
	 * @description Método para obtener un medicamento por su ID.
	 * @static
	 * @async
	 * @memberof MedicamentoModel
	 * @param {number} id - El ID del medicamento.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El medicamento.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findById(id, dbConn) {
		const query =
			'SELECT ' +
			'   id, ' +
			'   nombre, ' +
			'   descripcion ' +
			'FROM ' +
			'   medicamento ' +
			'WHERE ' +
			'   id = ?';

		try {
			const [rows] = await dbConn.execute(query, [id]);

			if (rows.length === 0) {
				return null;
			}

			return {
				id: rows[0].id,
				datos_medicamento: {
					nombre: rows[0].nombre,
					descripcion: rows[0].descripcion,
				}
			};

		} catch (err) {
			throw new Error('Error al obtener el medicamento.');
		}
	}

	/**
	 * @method findByNombre
	 * @description Método para obtener un medicamento por su nombre.
	 * @static
	 * @async
	 * @memberof MedicamentoModel
	 * @param {string} nombre - El nombre del medicamento.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El medicamento.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findByNombre(nombre, dbConn) {
		const query =
			'SELECT ' +
			'   id, ' +
			'   nombre, ' +
			'   descripcion ' +
			'FROM ' +
			'   medicamento ' +
			'WHERE ' +
			'   nombre = ?';

		try {
			const [rows] = await dbConn.execute(query, [nombre]);

			if (rows.length === 0) {
				return null;
			}

			return {
				id: rows[0].id,
				datos_medicamento: {
					nombre: rows[0].nombre,
					descripcion: rows[0].descripcion,
				}
			};

		} catch (err) {
			throw new Error('Error al obtener el medicamento.');
		}
	}

	/**
	 * @method save
	 * @description Método para crear un nuevo medicamento.
	 * @static
	 * @async
	 * @memberof MedicamentoModel
	 * @param {Object} medicamento - El objeto del nuevo medicamento.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo medicamento creado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async save(medicamento, dbConn) {
		const nombre = medicamento.nombre;
		const descripcion = medicamento.descripcion;

		const query =
			'INSERT INTO medicamento (nombre, descripcion) ' +
			'		VALUES (?, ?)';

		try {
			const insert = await dbConn.execute(query, [nombre, descripcion]);

			return {
				id: insert[0].insertId,
				datos_medicamento: {
					nombre: nombre,
					descripcion: descripcion,
				}
			};
		} catch (err) {
			throw new Error('Error al crear el medicamento.');
		}
	}

	/**
	 * @method updateById
	 * @description Método para actualizar un medicamento por su ID.
	 * @static
	 * @async
	 * @memberof MedicamentoModel
	 * @param {number} id - El ID del medicamento.
	 * @param {Object} medicamento - El objeto del medicamento con los datos actualizados.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El medicamento actualizado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateById(id, medicamento, dbConn) {
		const nombre = medicamento.nombre;
		const descripcion = medicamento.descripcion;

		try {
			const query =
				'UPDATE ' +
				'   medicamento ' +
				'SET ' +
				'   nombre = ?, ' +
				'   descripcion = ? ' +
				'WHERE ' +
				'   id = ?';

			return await dbConn.execute(query, [nombre, descripcion, id]);
		} catch (err) {
			throw new Error('Error al actualizar el medicamento.');
		}
	}
}

// Exportación del modelo
export default MedicamentoModel;
