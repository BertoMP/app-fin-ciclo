// Importación del modelo del servicio
import ProvinciaModel from '../models/provincia.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class ProvinciaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Provincia.
 */
class ProvinciaService {
	/**
	 * @method readProvincias
	 * @description Método para leer todas las provincias.
	 * @static
	 * @async
	 * @memberof ProvinciaService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de provincias.
	 */
	static async readProvincias(conn = dbConn) {
		return await ProvinciaModel.fetchAll(conn);
	}
}

// Exportación del servicio
export default ProvinciaService;
