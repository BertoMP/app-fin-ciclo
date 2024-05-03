// Importación del modelo del servicio
import ConsultaModel from '../models/consulta.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class ConsultaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Consulta.
 */
class ConsultaService {
	/**
	 * @method readConsultas
	 * @description Método para leer consultas.
	 * @static
	 * @async
	 * @memberOf ConsultaService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de consultas.
	 */
	static async readConsultas(searchValues, conn = dbConn) {
		return await ConsultaModel.findAll(searchValues, conn);
	}

	/**
	 * @method readConsultasListado
	 * @description Método para leer consultas.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de consultas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async readConsultasListado(conn = dbConn) {
		return await ConsultaModel.findAllListado(conn);
	}

	/**
	 * @method readConsultaById
	 * @description Método para leer una consulta por su ID.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta.
	 */
	static async readConsultaById(id, conn = dbConn) {
		return await ConsultaModel.findById(id, conn);
	}

	/**
	 * @method createConsulta
	 * @description Método para crear una consulta.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {Object} consulta - Los datos de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta creada.
	 */
	static async createConsulta(consulta, conn = dbConn) {
		return await ConsultaModel.createConsulta(consulta, conn);
	}

	/**
	 * @method updateConsulta
	 * @description Método para actualizar una consulta.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} consulta - Los nuevos datos de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta actualizada.
	 */
	static async updateConsulta(id, consulta, conn = dbConn) {
		return await ConsultaModel.updateConsulta(id, consulta, conn);
	}

	/**
	 * @method deleteConsulta
	 * @description Método para eliminar una consulta.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta eliminada.
	 */
	static async deleteConsulta(id, conn = dbConn) {
		return await ConsultaModel.deleteConsulta(id, conn);
	}

	/**
	 * @method readConsultaByName
	 * @description Método para leer una consulta por su nombre.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {string} nombre - El nombre de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta.
	 */
	static async readConsultaByName(nombre, conn = dbConn) {
		return await ConsultaModel.findByName(nombre, conn);
	}
}

// Exportación del servicio
export default ConsultaService;
