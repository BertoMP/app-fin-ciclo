// Importación del modelo del servicio
import EspecialistaModel from '../models/especialista.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';

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

	/**
	 * @method readEspecialistasByEspecialidad
	 * @description Método para leer los especialistas por su ID de especialidad.
	 * @static
	 * @async
	 * @memberOf EspecialistaService
	 * @param {number} especialidad_id - El ID de la especialidad.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Los especialistas.
	 * @throws {Error} Si no se encuentran especialistas, se lanzará un error.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async readEspecialistasByEspecialidad(especialidad_id, conn = dbConn) {
		try {
			const especialistas = await EspecialistaModel.findByEspecialidadId(especialidad_id, conn);

			if (!especialistas) {
				throw new Error('Especialistas no encontrados.');
			}

			return especialistas;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readEspecialistaByUserId
	 * @description Método para leer un especialista por su ID de usuario.
	 * @static
	 * @async
	 * @memberOf EspecialistaService
	 * @param {number} usuario_id - El ID de usuario del especialista.
	 * @param {boolean} includeNotWorking - Si se incluye a los especialistas que no están trabajando.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista.
	 * @throws {Error} Si el especialista no se encuentra, se lanzará un error.
	 * @throws {Error} Si el especialista no está trabajando y no se incluyen los que no están trabajando, se lanzará un error.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async readEspecialistaByUserId(usuario_id, includeNotWorking = false, conn = dbConn) {
		try {
			const especialista = await EspecialistaModel.findByUserId(usuario_id, conn);

			if (!especialista) {
				throw new Error('Especialista no encontrado.');
			}

			if (!includeNotWorking && especialista.datos_especialista.turno === 'no-trabajando') {
				throw new Error('Especialista no encontrado.');
			}

			return especialista;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readEspecialistaByNumColegiado
	 * @description Método para leer un especialista por su número de colegiado.
	 * @static
	 * @async
	 * @memberOf EspecialistaService
	 * @param {string} num_colegiado - El número de colegiado del especialista.
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
	 * @returns {Promise<Object>}
	 */
	static async deleteEspecialista(id, conn = null) {
		return await EspecialistaModel.deleteEspecialistaById(id, conn);
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

	/**
	 * @method setTrabajando
	 * @description Método para establecer a un especialista como trabajando.
	 * @static
	 * @async
	 * @memberof EspecialistaService
	 * @param {number} especialista_id - El ID del especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El especialista actualizado.
	 */
	static async readTurnoByEspecialistaId(especialista_id, conn = dbConn) {
		return await EspecialistaModel.findTurnoById(especialista_id, conn);
	}
}

// Exportación del servicio
export default EspecialistaService;
