/**
 * @class UsuarioModel
 * @description Clase que contiene los métodos para interactuar con la tabla de usuario.
 */
class UsuarioModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todos los usuarios.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {number} limit - El número de usuarios por página.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto con los usuarios y la información de la paginación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(searchValues, limit, dbConn) {
		const page = searchValues.page;
		const role_id = searchValues.role;

		const offset = (page - 1) * limit;

		let query =
			'SELECT ' +
			'   usuario.id,' +
			'   email,' +
			'   usuario.nombre,' +
			'   primer_apellido,' +
			'   segundo_apellido,' +
			'   dni,' +
			'   rol_id,' +
			'   rol.nombre AS nombre_rol ' +
			'FROM ' +
			'   usuario ' +
			'INNER JOIN ' +
			'   rol ON usuario.rol_id = rol.id ' +
			'LEFT JOIN ' +
			'   paciente ON usuario.id = paciente.usuario_id ' +
			'LEFT JOIN ' +
			'	 especialista ON usuario.id = especialista.usuario_id ' +
			'WHERE ' +
			'   rol_id <> 1 AND ' +
			'   (turno IS NULL OR turno <> "no-trabajando")';

		let countQuery =
			'SELECT ' +
			'		COUNT(*) AS count ' +
			'FROM ' +
			'		usuario ' +
			'INNER JOIN ' +
			'		rol ON usuario.rol_id = rol.id ' +
			'LEFT JOIN ' +
			'		paciente ON usuario.id = paciente.usuario_id ' +
			'LEFT JOIN ' +
			'		especialista ON usuario.id = especialista.usuario_id ' +
			'WHERE ' +
			'		rol_id <> 1 AND ' +
			'		(turno IS NULL OR turno <> "no-trabajando")';

		let queryParams = [`${limit}`, `${offset}`];
		let countParams = [];

		if (role_id) {
			query += 'AND rol_id = ? ';
			countQuery += 'AND rol_id = ? ';
			queryParams.unshift(`${role_id}`);
			countParams.push(`${role_id}`);
		}

		query += ' ORDER BY usuario.id ASC LIMIT ? OFFSET ?';

		try {
			const [rows] = await dbConn.execute(query, queryParams);
			const [count] = await dbConn.execute(countQuery, countParams);
			const total = count[0].count;
			const actualPage = page;
			const totalPages = Math.ceil(total / limit);

			const formattedRows = rows.map((row) => {
				return {
					usuario_id: row.id,
					datos_personales: {
						email: row.email,
						nombre: row.nombre,
						primer_apellido: row.primer_apellido,
						segundo_apellido: row.segundo_apellido,
						dni: row.dni,
					},
					datos_rol: {
						rol_id: row.rol_id,
						nombre_rol: row.nombre_rol,
					}
				};
			});

			return { formattedRows, total, actualPage, totalPages };
		} catch (err) {
			console.log(err);
			throw new Error('Error al obtener los usuarios.');
		}
	}

	/**
	 * @method findByEmail
	 * @description Método para obtener un usuario por su email.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {string} email - El email del usuario.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findByEmail(email, dbConn) {
		const query =
			'SELECT ' +
			'   id, ' +
			'   email, ' +
			'   password,' +
			'   nombre, ' +
			'   primer_apellido, ' +
			'   segundo_apellido, ' +
			'   dni, ' +
			'   rol_id ' +
			'FROM ' +
			'   usuario ' +
			'WHERE ' +
			'   email = ?';

		try {
			const [rows] = await dbConn.execute(query, [email]);
			return rows[0];
		} catch (err) {
			throw new Error('Error al obtener el usuario.');
		}
	}

	/**
	 * @method findByDNI
	 * @description Método para obtener un usuario por su DNI.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {string} dni - El DNI del usuario.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findByDNI(dni, dbConn) {
		const query =
			'SELECT ' +
			'   id, ' +
			'   email, ' +
			'   nombre, ' +
			'   primer_apellido, ' +
			'   segundo_apellido, ' +
			'   dni, ' +
			'   rol_id ' +
			'FROM ' +
			'   usuario ' +
			'WHERE ' +
			'   dni = ?';

		try {
			const [rows] = await dbConn.execute(query, [dni]);
			return rows[0];
		} catch (err) {
			throw new Error('Error al obtener el usuario.');
		}
	}

	/**
	 * @method create
	 * @description Método para crear un nuevo usuario.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {Object} usuario - El objeto del nuevo usuario.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario creado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async create(usuario, dbConn) {
		const email = usuario.email;
		const password = usuario.password;
		const nombre = usuario.nombre;
		const primer_apellido = usuario.primer_apellido;
		const segundo_apellido = usuario.segundo_apellido;
		const dni = usuario.dni;
		const rol_id = usuario.rol_id;

		const query =
			'INSERT INTO usuario ' +
			'(email, password, nombre, primer_apellido, segundo_apellido, ' +
			' dni, rol_id) ' +
			'   VALUES (?, ?, ?, ?, ?, ?, ?)';

		try {
			const user = await dbConn.execute(query, [
				email,
				password,
				nombre,
				primer_apellido,
				segundo_apellido,
				dni,
				rol_id,
			]);

			return user[0];
		} catch (err) {
			throw new Error('Error al crear el usuario.');
		}
	}

	/**
	 * @method updatePassword
	 * @description Método para actualizar la contraseña de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {string} email - El email del usuario.
	 * @param {string} password - La nueva contraseña.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de actualización.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updatePassword(email, password, dbConn) {
		const query = 'UPDATE usuario SET password = ? WHERE email = ?';

		try {
			return await dbConn.execute(query, [password, email]);
		} catch (err) {
			throw new Error('Error al actualizar la contraseña.');
		}
	}

	/**
	 * @method getEmailById
	 * @description Método para obtener el email de un usuario por su ID.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {number} id - El ID del usuario.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<string>} El email del usuario.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async getEmailById(id, dbConn) {
		const query = 'SELECT email FROM usuario WHERE id = ?';

		try {
			const [rows] = await dbConn.execute(query, [id]);
			return rows[0].email;
		} catch (err) {
			throw new Error('Error al obtener el email.');
		}
	}

	/**
	 * @method deleteUsuario
	 * @description Método para eliminar un usuario por su ID.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {number} id - El ID del usuario.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteUsuario(id, dbConn) {
		const query = 'DELETE FROM usuario WHERE id = ?';

		try {
			return await dbConn.execute(query, [id]);
		} catch (err) {
			throw new Error('Error al eliminar el usuario.');
		}
	}

	/**
	 * @method updateRefreshToken
	 * @description Método para actualizar el token de refresco de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {number} userId - El ID del usuario.
	 * @param {null} refreshToken - El nuevo token de refresco.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de actualización.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateRefreshToken(userId, refreshToken, dbConn) {
		const query = 'UPDATE usuario SET refresh_token = ? WHERE id = ?';

		try {
			return await dbConn.execute(query, [refreshToken, userId]);
		} catch (err) {
			throw new Error('Error al actualizar el token de refresco.');
		}
	}

	/**
	 * @method findById
	 * @description Método para obtener un usuario por su ID.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {number} id - El ID del usuario.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findById(id, dbConn) {
		const query =
			'SELECT ' +
			'   usuario.id, ' +
			'   email, ' +
			'   usuario.nombre AS usuario_nombre, ' +
			'   primer_apellido, ' +
			'   segundo_apellido, ' +
			'   dni, ' +
			'   rol_id, ' +
			'   rol.nombre AS nombre_rol ' +
			'FROM ' +
			'   usuario ' +
			'INNER JOIN ' +
			'   rol ON usuario.rol_id = rol.id ' +
			'WHERE ' +
			'   usuario.id = ?';

		try {
			const [rows] = await dbConn.execute(query, [id]);

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
					rol_id: rows[0].rol_id,
					nombre_rol: rows[0].nombre_rol,
				}
			};
		} catch (err) {
			console.log(err);
			throw new Error('Error al obtener el usuario.');
		}
	}

	/**
	 * @method updateUsuario
	 * @description Método para actualizar un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioModel
	 * @param {Object} usuario - El objeto del usuario con los datos actualizados.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de actualización.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateUsuario(usuario, dbConn) {
		const query =
			'UPDATE ' +
			'   usuario ' +
			'SET ' +
			'   email = ?, ' +
			'   nombre = ?, ' +
			'   primer_apellido = ?, ' +
			'   segundo_apellido = ?, ' +
			'   dni = ? ' +
			'WHERE ' +
			'   id = ?';

		try {
			return await dbConn.execute(query, [
				usuario.email,
				usuario.nombre,
				usuario.primer_apellido,
				usuario.segundo_apellido,
				usuario.dni,
				usuario.id,
			]);
		} catch (err) {
			throw new Error('Error al actualizar el usuario.');
		}
	}
}

// Exportación del modelo
export default UsuarioModel;
