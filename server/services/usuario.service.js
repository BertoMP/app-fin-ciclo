// Importación del modelo del servicio
import UsuarioModel from '../models/usuario.model.js';

// Importación de los servicios auxiliares
import PacienteService from './paciente.service.js';
import EspecialistaService from './especialista.service.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class UsuarioService
 * @description Clase que contiene los métodos para interactuar con el modelo de Usuario.
 */
class UsuarioService {
	/**
	 * @method readAllUsuarios
	 * @description Método para leer todos los usuarios.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {number} limit - El límite de resultados.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de usuarios.
	 */
	static async readAllUsuarios(searchValues, limit, conn = dbConn) {
		return await UsuarioModel.fetchAll(searchValues, limit, conn);
	}

	/**
	 * @method createUsuarioPaciente
	 * @description Método para crear un nuevo usuario y un nuevo paciente asociado a ese usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {Object} usuario - El objeto del nuevo usuario.
	 * @param {Object} paciente - El objeto del nuevo paciente.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá creado un nuevo usuario y un nuevo paciente en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createUsuarioPaciente(usuario, paciente, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const newUser = await UsuarioModel.create(usuario, conn);
			paciente.usuario_id = newUser.insertId;
			await PacienteService.createPaciente(paciente, conn);

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw new Error(err);
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method createUsuarioEspecialista
	 * @description Método para crear un nuevo usuario y un nuevo especialista asociado a ese usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {Object} usuario - El objeto del nuevo usuario.
	 * @param {Object} especialista - El objeto del nuevo especialista.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá creado un nuevo usuario y un nuevo especialista en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createUsuarioEspecialista(usuario, especialista, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const usuarioCreado = await UsuarioModel.create(usuario, conn);
			especialista.usuario_id = usuarioCreado.insertId;
			await EspecialistaService.create(especialista, conn);

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw new Error(err);
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method updateUsuarioPaciente
	 * @description Método para actualizar un usuario y un paciente asociado a ese usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {Object} usuario - El objeto del usuario a actualizar.
	 * @param {Object} paciente - El objeto del paciente a actualizar.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá actualizado el usuario y el paciente en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateUsuarioPaciente(usuario, paciente, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			await UsuarioModel.updateUsuario(usuario, conn);
			await PacienteService.updatePacienteByUserId(paciente, conn);

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw new Error(err);
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method updateUsuarioEspecialista
	 * @description Método para actualizar un usuario y un especialista asociado a ese usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {Object} usuario - El objeto del usuario a actualizar.
	 * @param {Object} especialista - El objeto del especialista a actualizar.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá actualizado el usuario y el especialista en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateUsuarioEspecialista(usuario, especialista, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			await UsuarioModel.updateUsuario(usuario, conn);
			await EspecialistaService.updateEspecialista(especialista, conn);

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw new Error(err);
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method readEmailByUserId
	 * @description Método para leer el correo electrónico de un usuario por su ID.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<string>} El correo electrónico del usuario.
	 */
	static async readEmailByUserId(id, conn = dbConn) {
		return await UsuarioModel.getEmailById(id, conn);
	}

	/**
	 * @method readUsuarioByEmail
	 * @description Método para leer un usuario por su correo electrónico.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {string} email - El correo electrónico del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario.
	 */
	static async readUsuarioByEmail(email, conn = dbConn) {
		return await UsuarioModel.findByEmail(email, conn);
	}

	/**
	 * @method readUsuarioByDNI
	 * @description Método para leer un usuario por su DNI.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {string} dni - El DNI del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario.
	 */
	static async readUsuarioByDNI(dni, conn = dbConn) {
		return await UsuarioModel.findByDNI(dni, conn);
	}

	/**
	 * @method updatePassword
	 * @description Método para actualizar la contraseña de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {string} email - El correo electrónico del usuario.
	 * @param {string} password - La nueva contraseña del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de actualización.
	 */
	static async updatePassword(email, password, conn = dbConn) {
		return await UsuarioModel.updatePassword(email, password, conn);
	}

	/**
	 * @method updateRefreshToken
	 * @description Método para actualizar el token de actualización de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} userId - El ID del usuario.
	 * @param {null | string} refreshToken - El nuevo token de actualización.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de actualización.
	 */
	static async updateRefreshToken(userId, refreshToken, conn = dbConn) {
		return await UsuarioModel.updateRefreshToken(userId, refreshToken, conn);
	}

	/**
	 * @method readUsuarioById
	 * @description Método para leer un usuario por su ID.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario.
	 */
	static async readUsuarioById(id, conn = dbConn) {
		return await UsuarioModel.findById(id, conn);
	}

	/**
	 * @method deleteUsuario
	 * @description Método para eliminar un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteUsuario(id, conn = dbConn) {
		return await UsuarioModel.deleteUsuario(id, conn);
	}
}

// Exportación del servicio
export default UsuarioService;
