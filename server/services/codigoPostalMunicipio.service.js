// Importación del modelo del servicio
import CodigoPostalMunicipioModel from '../models/codigoPostalMunicipio.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class CodigoPostalMunicipioService
 * @description Clase que contiene los métodos para interactuar con el modelo de CodigoPostalMunicipio.
 */
class CodigoPostalMunicipioService {
	/**
	 * @method readCodigoPostalByMunicipioId
	 * @description Método para leer un código postal por el ID del municipio.
	 * @static
	 * @async
	 * @memberof CodigoPostalMunicipioService
	 * @param {number} cod_municipio - El ID del municipio.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa el código postal.
	 */
	static async readCodigoPostalByMunicipioId(cod_municipio, conn = dbConn) {
		return await CodigoPostalMunicipioModel.findByMunicipioId(cod_municipio, conn);
	}
}

// Exportación del servicio
export default CodigoPostalMunicipioService;
