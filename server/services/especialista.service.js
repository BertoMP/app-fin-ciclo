// Importación del modelo del servicio
import EspecialistaModel from '../models/especialista.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import UsuarioService from "./usuario.service.js";

/**
 * @class EspecialistaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Especialista.
 */
class EspecialistaService {
	/**
	 * @method createEspecialista
	 * @description Método para crear un nuevo especialista.
	 * @static
	 * @async
	 * @memberOf EspecialistaService
	 * @param {Object} especialista - El objeto del nuevo especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo especialista creado.
	 */
	static async createEspecialista(especialista, conn = dbConn) {
		return await EspecialistaModel.create(especialista, conn);
	}

	static async readEspecialistaByUserId(usuario_id, conn = dbConn) {
		return await EspecialistaModel.findByUserId(usuario_id, conn);
	}

	/**
	 * @method readEspecialistaByNumColegiado
	 * @description Método para leer un especialista por su número de colegiado.
	 * @static
	 * @async
	 * @memberOf EspecialistaService
	 * @param {number} num_colegiado - El número de colegiado del especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 */
	static async readEspecialistaByNumColegiado(num_colegiado, conn = dbConn) {
		return await EspecialistaModel.findByNumColegiado(num_colegiado, conn);
	}

	/**
	 * @method readEspecialistaByConsultaId
	 * @description Método para leer un especialista por su ID de consulta.
	 * @static
	 * @async
	 * @memberof EspecialistaService
	 * @param {number} consulta_id - El ID de la consulta del especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 */
	static async readEspecialistaByConsultaId(consulta_id, conn = dbConn) {
		return await EspecialistaModel.findByConsultaId(consulta_id, conn);
	}

	/**
	 * @method readEspecialistaByEspecialistaId
	 * @description Método para leer un especialista por su ID de especialista.
	 * @static
	 * @async
	 * @memberof EspecialistaService
	 * @param {number} especialista_id - El ID del especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 */
	static async readEspecialistaByEspecialistaId(especialista_id, conn = dbConn) {
		return await EspecialistaModel.findEspecialistaById(especialista_id, conn);
	}

	/**
	 * @method updateEspecialista
	 * @description Método para actualizar un especialista por su ID.
	 * @static
	 * @async
	 * @memberof EspecialistaService
	 * @param {Object} especialista - El especialista a actualizar.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista actualizado.
	 */
	static async updateEspecialista(especialista, conn = dbConn) {
		return await EspecialistaModel.updateEspecialista(especialista, conn);
	}

	/**
	 * @method deleteEspecialistaById
	 * @description Método para eliminar un especialista por su ID.
	 * @static
	 * @async
	 * @memberof EspecialistaService
	 * @param {number} id - El ID del especialista.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>}
	 */
	static async deleteEspecialista(id, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			await EspecialistaModel.deleteEspecialistaById(id, conn);
			await UsuarioService.deleteUsuario(id, conn);

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
	 * @method setTrabajando
	 * @description Método para establecer a un especialista como no-trabajando.
	 * @static
	 * @async
	 * @memberof EspecialistaService
	 * @param {number} id - El ID del especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista actualizado.
	 */
	static async setNoTrabajando(id, conn = dbConn) {
		return await EspecialistaModel.setNoTrabajandoById(id, conn);
	}
}

// Exportación del servicio
export default EspecialistaService;
