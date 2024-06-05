// Importación del modelo del servicio
import TomaModel from '../models/toma.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class TomaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Toma.
 */
class TomaService {
	/**
	 * @method createToma
	 * @description Método para crear una nueva toma.
	 * @static
	 * @async
	 * @memberof TomaService
	 * @param {Object} prescripcion - El objeto de la nueva toma.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva toma creada.
	 */
	static async createToma(prescripcion, conn = dbConn) {
		return await TomaModel.createToma(prescripcion, conn);
	}

	/**
	 * @method deleteToma
	 * @description Método para eliminar una toma por su ID.
	 * @static
	 * @async
	 * @memberof TomaService
	 * @param {number} id - El ID de la toma.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deleteToma(id, conn = dbConn) {
		return await TomaModel.deleteToma(id, conn);
	}

	/**
	 * @method findToma
	 * @description Método para buscar una toma por su ID.
	 * @static
	 * @async
	 * @memberof TomaService
	 * @param {number} id - El ID de la toma.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La toma encontrada.
	 */
	static async findToma(id, conn = dbConn) {
		return await TomaModel.findToma(id, conn);
	}

	/**
	 * @method deleteAllTomas
	 * @description Método para eliminar todas las tomas de un paciente.
	 * @static
	 * @async
	 * @memberof TomaService
	 * @param {Object} tomas - Las tomas a eliminar.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} - El resultado de la operación de eliminación.
	 */
	static async deleteAllTomas(tomas, conn = dbConn) {
		return await TomaModel.deleteAllTomas(tomas, conn);
	}
}

// Exportación del servicio
export default TomaService;
