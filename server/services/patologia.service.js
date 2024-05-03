// Importación del modelo del servicio
import PatologiaModel from '../models/patologia.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class PatologiaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Patologia.
 */
class PatologiaService {
	/**
	 * @method readPatologiasInforme
	 * @description Método para leer todas las patologías de un informe.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de patologías de un informe.
	 */
	static async readPatologiasInforme(conn = dbConn) {
		return await PatologiaModel.fetchAllInforme(conn);
	}

	/**
	 * @method readPatologias
	 * @description Método para leer todas las patologías.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto con patologías.
	 */
	static async readPatologias(searchValues, conn = dbConn) {
		return await PatologiaModel.fetchAll(searchValues, conn);
	}

	/**
	 * @method readPatologiaById
	 * @description Método para leer una patología por su ID.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {number} id - El ID de la patología.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La patología.
	 */
	static async readPatologiaById(id, conn = dbConn) {
		return await PatologiaModel.findById(id, conn);
	}

	/**
	 * @method readPatologiaByNombre
	 * @description Método para leer una patología por su nombre.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {string} nombre - El nombre de la patología.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La patología.
	 */
	static async readPatologiaByNombre(nombre, conn = dbConn) {
		return await PatologiaModel.findByNombre(nombre, conn);
	}

	/**
	 * @method createPatologia
	 * @description Método para crear una nueva patología.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {Object} patologia - El objeto de la nueva patología.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<void>} No devuelve nada.
	 */
	static async createPatologia(patologia, conn = dbConn) {
		await PatologiaModel.save(patologia, conn);
	}

	/**
	 * @method updatePatologia
	 * @description Método para actualizar una patología por su ID.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {number} id - El ID de la patología.
	 * @param {Object} patologia - El objeto de la patología con los datos actualizados.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<void>} No devuelve nada.
	 */
	static async updatePatologia(id, patologia, conn = dbConn) {
		await PatologiaModel.updateById(id, patologia, conn);
	}
}

// Exportación del servicio
export default PatologiaService;
