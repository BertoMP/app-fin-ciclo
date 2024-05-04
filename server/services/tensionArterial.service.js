// Importación del modelo del servicio
import TensionArterialModel from '../models/tensionArterial.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class TensionArterialService
 * @description Clase que contiene los métodos para interactuar con el modelo de TensionArterial.
 */
class TensionArterialService {
	/**
	 * @method readTensionArterial
	 * @description Método para leer todas las tensiones arteriales.
	 * @static
	 * @async
	 * @memberof TensionArterialService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {number} paciente_id - El ID del paciente.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de tensiones arteriales.
	 */
	static async readTensionArterial(searchValues, paciente_id, conn = dbConn) {
		return await TensionArterialModel.fetchAll(searchValues, paciente_id, conn);
	}

	/**
	 * @method createTensionArterial
	 * @description Método para crear una nueva tensión arterial.
	 * @static
	 * @async
	 * @memberof TensionArterialService
	 * @param {Object} tensionArterial - El objeto de la nueva tensión arterial.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva tensión arterial creada.
	 */
	static async createTensionArterial(tensionArterial, conn = dbConn) {
		return await TensionArterialModel.create(tensionArterial, conn);
	}

	/**
	 * @method deleteTensionArterialByUserId
	 * @description Método para eliminar una tensión arterial por su ID de usuario.
	 * @static
	 * @async
	 * @memberof TensionArterialService
	 * @param {number} userId - El ID de usuario de la tensión arterial.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deleteTensionArterialByUserId(userId, conn = dbConn) {
		return await TensionArterialModel.deleteTensionesArterialesByUserId(userId, conn);
	}
}

// Exportación del servicio
export default TensionArterialService;
