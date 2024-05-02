// Importación del modelo del servicio
import GlucometriaModel from '../models/glucometria.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class GlucometriaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Glucometria.
 */
class GlucometriaService {
	/**
	 * @method readGlucometria
	 * @description Método para leer las glucometrias basado en los valores de búsqueda y un límite.
	 * @static
	 * @async
	 * @memberof GlucometriaService
	 * @param {Object} searchValues - Los valores de búsqueda para las glucometrias.
	 * @param {number} limit - El número de resultados a devolver.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de glucometrias.
	 */
	static async readGlucometria(searchValues, limit, conn = dbConn) {
		return await GlucometriaModel.fetchAll(searchValues, limit, conn);
	}

	/**
	 * @method createGlucometria
	 * @description Método para crear una nueva glucometria.
	 * @static
	 * @async
	 * @memberof GlucometriaService
	 * @param {Object} glucometria - El objeto de la nueva glucometria.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva glucometria creada.
	 */
	static async createGlucometria(glucometria, conn = dbConn) {
		return await GlucometriaModel.create(glucometria, conn);
	}

	/**
	 * @method deleteGlucometriaByUserId
	 * @description Método para eliminar las glucometrias de un usuario por su ID.
	 * @static
	 * @async
	 * @memberof GlucometriaService
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deleteGlucometriaByUserId(userId, conn = dbConn) {
		return await GlucometriaModel.deleteGlucometriasByUserId(userId, conn);
	}
}

// Exportación del servicio
export default GlucometriaService;
