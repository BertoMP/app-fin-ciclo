// Importación del modelo del servicio
import UsuarioModel from '../models/usuario.model.js';

// Importación de los servicios auxiliares
import PacienteService from './paciente.service.js';
import EspecialistaService from './especialista.service.js';
import EmailService from "./email.service.js";

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";
import { createEncryptedPassword } from "../util/functions/createEncryptedPassword.js";
import pkg from 'bcryptjs';
const { compare } = pkg;

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
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de usuarios.
	 */
	static async readAllUsuarios(searchValues, conn = dbConn) {
		return await UsuarioModel.fetchAll(searchValues, conn);
	}

	static async getRoleByUserId(userId, conn = dbConn) {
		return await UsuarioModel.getRoleByUserId(userId, conn);
	}

	/**
	 * @method createUsuario
	 * @description Método para crear un nuevo usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param data - Los datos del usuario a crear.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá creado un nuevo usuario y un nuevo paciente en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createUsuario(data, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const usuario = await ObjectFactory.createUserObject(data);
			const nuevoUsuario = await UsuarioModel.create(usuario, conn);

			if (usuario.rol_id === 2) {
				const paciente = ObjectFactory.createPacienteObject(data);
				paciente.usuario_id = nuevoUsuario.insertId;
				await PacienteService.createPaciente(paciente, conn);
				await EmailService.sendWelcomeEmail(usuario.email, usuario.nombre);
			} else {
				const especialista = ObjectFactory.createEspecialistaObject(data);
				especialista.usuario_id = nuevoUsuario.insertId;
				await EspecialistaService.createEspecialista(especialista, conn);
			}

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
	 * @method updateUsuario
	 * @description Método para actualizar un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param data - Los datos del usuario a actualizar.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá actualizado el usuario y el paciente o especialista asociado en la base de datos.
	 */
	static async updateUsuario(data, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const password = data.datos_personales.password;
			const realPassword = await UsuarioModel.getPasswordById(data.usuario_id, conn);

			const validPassword = await compare(password, realPassword.password);

			if (!validPassword) {
				throw new Error('La contraseña actual no es correcta.');
			}

			const usuario = ObjectFactory.updateUserObject(data);

			await UsuarioModel.updateUsuario(usuario, conn);

			if (data.datos_paciente) {
				const paciente = ObjectFactory.updatePacienteObject(data);
				await PacienteService.updatePaciente(paciente, conn);
			} else {
				const especialista = ObjectFactory.updateEspecialistaObject(data);
				await EspecialistaService.updateEspecialista(especialista, conn);
			}

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
