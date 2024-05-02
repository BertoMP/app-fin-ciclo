// Importación del modelo del servicio
import MunicipioModel from '../models/municipio.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class MunicipioService
 * @description Clase que contiene los métodos para interactuar con el modelo de Municipio.
 */
class MunicipioService {
	/**
	 * @method readMunicipioByProvinciaId
	 * @description Método para leer un municipio por el ID de su provincia.
	 * @static
	 * @async
	 * @memberof MunicipioService
	 * @param {number} id - El ID de la provincia.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de los municipios de la provincia.
	 */
	static async readMunicipioByProvinciaId(id, conn = dbConn) {
		return await MunicipioModel.fetchByProvinciaId(id, conn);
	}
}

// Exportación del servicio
export default MunicipioService;
