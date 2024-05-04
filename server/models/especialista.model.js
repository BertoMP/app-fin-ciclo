/**
 * @class EspecialistaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de especialistas.
 */
class EspecialistaModel {
	/**
	 * @method create
	 * @description Método para crear un nuevo especialista.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {Object} especialista - El objeto del nuevo especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo especialista creado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async create(especialista, dbConn) {
		const usuario_id = especialista.usuario_id;
		const especialidad_id = especialista.especialidad_id;
		const consulta_id = especialista.consulta_id;
		const num_colegiado = especialista.num_colegiado;
		const descripcion = especialista.descripcion;
		const imagen = especialista.imagen;
		const turno = especialista.turno;

		const query =
			'INSERT INTO especialista ' +
			'(usuario_id, especialidad_id, consulta_id, num_colegiado,' +
			' descripcion, imagen, turno) ' +
			'   VALUES (?, ?, ?, ?, ?, ?, ?)';

		try {
			return await dbConn.execute(query, [
				usuario_id,
				especialidad_id,
				consulta_id,
				num_colegiado,
				descripcion,
				imagen,
				turno,
			]);
		} catch (err) {
			throw new Error('Error al crear el especialista.');
		}
	}

	/**
	 * @method findByNumColegiado
	 * @description Método para obtener un especialista por su número de colegiado.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {number} num_colegiado - El número de colegiado del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findByNumColegiado(num_colegiado, dbConn) {
		const query =
			'SELECT ' +
			'    usuario_id, ' +
			'    especialidad_id, ' +
			'    consulta_id, ' +
			'    num_colegiado, ' +
			'    descripcion, ' +
			'    imagen, ' +
			'    turno ' +
			'FROM ' +
			'   especialista ' +
			'WHERE ' +
			'   num_colegiado = ?';

		try {
			const [rows] = await dbConn.execute(query, [num_colegiado]);
			return rows[0];
		} catch (err) {
			throw new Error('Error al obtener el especialista.');
		}
	}

	/**
	 * @method findByConsultaId
	 * @description Método para obtener un especialista por su ID de consulta.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {number} consulta_id - El ID de consulta del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findByConsultaId(consulta_id, dbConn) {
		const query =
			'SELECT ' +
			'    usuario_id, ' +
			'    especialidad_id, ' +
			'    consulta_id, ' +
			'    num_colegiado, ' +
			'    descripcion, ' +
			'    imagen, ' +
			'    turno ' +
			'FROM ' +
			'   especialista ' +
			'WHERE ' +
			'   consulta_id = ?';

		try {
			const [rows] = await dbConn.execute(query, [consulta_id]);
			return rows[0];
		} catch (err) {
			throw new Error('Error al obtener el especialista.');
		}
	}

	/**
	 * @method findEspecialistaById
	 * @description Método para obtener un especialista por su ID.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {number} especialista_id - El ID del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findEspecialistaById(especialista_id, dbConn) {
		const query =
			'SELECT ' +
			'    usuario_id, ' +
			'    especialidad_id, ' +
			'    consulta_id, ' +
			'    num_colegiado, ' +
			'    descripcion, ' +
			'    imagen, ' +
			'    turno ' +
			'FROM ' +
			'   especialista ' +
			'WHERE ' +
			'   usuario_id = ?';

		try {
			const [rows] = await dbConn.execute(query, [especialista_id]);
			return rows[0];
		} catch (err) {
			throw new Error('Error al obtener el turno del especialista.');
		}
	}

	/**
	 * @method findByUserId
	 * @description Método para obtener un especialista por su ID de usuario.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {number} usuario_id - El ID de usuario del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 */
	static async findByUserId(usuario_id, dbConn) {
		const query =
			'SELECT ' +
			'   usuario.id, ' +
			'   email, ' +
			'   usuario.nombre AS usuario_nombre, ' +
			'   primer_apellido, ' +
			'   segundo_apellido, ' +
			'   dni, ' +
			'   rol_id, ' +
			'		rol.nombre AS nombre_rol, ' +
			'   especialidad_id, ' +
			'		especialidad.nombre AS especialidad_nombre, ' +
			'   consulta_id, ' +
			'   consulta.nombre AS consulta_nombre, ' +
			'   num_colegiado, ' +
			'   especialista.descripcion, ' +
			'   especialista.imagen, ' +
			'   turno ' +
			'FROM ' +
			'   especialista ' +
			'INNER JOIN ' +
			'   especialidad ON especialista.especialidad_id = especialidad.id ' +
			'INNER JOIN ' +
			'   consulta ON especialista.consulta_id = consulta.id ' +
			'INNER JOIN ' +
			'   usuario ON especialista.usuario_id = usuario.id ' +
			'INNER JOIN ' +
			'   rol ON usuario.rol_id = rol.id ' +
			'WHERE ' +
			'   usuario_id = ?';

		try {
			const [rows] = await dbConn.execute(query, [usuario_id]);

			if (rows.length === 0) {
				return null;
			}

			return {
				usuario_id: rows[0].id,
				datos_personales: {
					email: rows[0].email,
					nombre: rows[0].usuario_nombre,
					primer_apellido: rows[0].primer_apellido,
					segundo_apellido: rows[0].segundo_apellido,
					dni: rows[0].dni,
				},
				datos_rol: {
					id: rows[0].rol_id,
					nombre: rows[0].nombre_rol,
				},
				datos_especialista: {
					especialidad: {
						especialidad_id: rows[0].especialidad_id,
						especialidad_nombre: rows[0].especialidad_nombre,
					},
					consulta: {
						consulta_id: rows[0].consulta_id,
						consulta_nombre: rows[0].consulta_nombre,
					},
					turno: rows[0].turno,
					num_colegiado: rows[0].num_colegiado,
					descripcion: rows[0].descripcion,
					imagen: rows[0].imagen,
				}
			}
		} catch (err) {
			throw new Error('Error al obtener el especialista.');
		}
	}

	/**
	 * @method updateEspecialista
	 * @description Método para actualizar un especialista por su ID de usuario.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {Object} especialista - El objeto del especialista con los datos actualizados.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista actualizado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateEspecialista(especialista, dbConn) {
		const usuario_id = especialista.id;
		const especialidad_id = especialista.especialidad_id;
		const consulta_id = especialista.consulta_id;
		const num_colegiado = especialista.num_colegiado;
		const descripcion = especialista.descripcion;
		const imagen = especialista.imagen;
		const turno = especialista.turno;

		const query =
			'UPDATE ' +
			'   especialista ' +
			'SET ' +
			'   especialidad_id = ?, ' +
			'   consulta_id = ?, ' +
			'   num_colegiado = ?, ' +
			'   descripcion = ?, ' +
			'   imagen = ?, ' +
			'   turno = ? ' +
			'WHERE ' +
			'   usuario_id = ?';

		try {
			return await dbConn.execute(query, [
				especialidad_id,
				consulta_id,
				num_colegiado,
				descripcion,
				imagen,
				turno,
				usuario_id,
			]);
		} catch (err) {
			throw new Error('Error al actualizar el especialista.');
		}
	}

	/**
	 * @method setTrabajandoById
	 * @description Método para establecer que un especialista no está trabajando por su ID.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {number} id - El ID del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @return {Promise<Object>} - El resultado de la operación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async setNoTrabajandoById(id, dbConn) {
		const query =
			'UPDATE ' +
			'   especialista ' +
			'SET ' +
			'   turno = "no-trabajando" ' +
			'WHERE ' +
			'   usuario_id = ?';

		try {
			return await dbConn.execute(query, [id]);
		} catch (err) {
			console.log(err);
			throw new Error('Error al actualizar el especialista.');
		}
	}

	/**
	 * @method deleteEspecialistaById
	 * @description Método para eliminar un especialista por su ID de usuario.
	 * @static
	 * @async
	 * @memberof EspecialistaModel
	 * @param {number} usuario_id - El ID de usuario del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteEspecialistaById(usuario_id, dbConn) {
		const query =
			'DELETE FROM ' +
			'   especialista ' +
			'WHERE ' +
			'   usuario_id = ?';

		try {
			return await dbConn.execute(query, [usuario_id]);
		} catch (err) {
			throw new Error('Error al eliminar el especialista.');
		}
	}
}

// Exportación del modelo
export default EspecialistaModel;
