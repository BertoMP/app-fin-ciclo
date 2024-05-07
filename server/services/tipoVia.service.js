// Importación del modelo del servicio
import TipoViaModel from '../models/tipoVia.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class TipoViaService
 * @description Clase que contiene los métodos para interactuar con el modelo de TipoVia.
 */
class TipoViaService {
	/**
	 * @method readTipoVia
	 * @description Método para leer todos los tipos de vías.
	 * @static
	 * @async
	 * @memberof TipoViaService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de tipos de vías.
	 */
	static async readTipoVia(conn = dbConn) {
		try {
			const tiposVia = await TipoViaModel.fetchAll(conn);

			if (!tiposVia) {
				throw new Error('Los tipos de vía no fueron encontrados.');
			}

			return tiposVia;
		} catch (err) {
			throw err;
		}
	}
}

// Exportación del servicio
export default TipoViaService;
