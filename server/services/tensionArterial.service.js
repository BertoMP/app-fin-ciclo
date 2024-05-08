// Importación del modelo del servicio
import TensionArterialModel from '../models/tensionArterial.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";

// Importación de las librerías necesarias
import pkg from 'moment-timezone';
const { tz } = pkg;

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
		try {
			const page = searchValues.page;
			const fechaInicio = searchValues.fechaInicio;
			const fechaFin = searchValues.fechaFin;
			const limit = searchValues.limit;

			const {
				formattedRows: resultados,
				total: cantidad_tensionArterial,
				actualPage: pagina_actual,
				totalPages: paginas_totales,
			} = await TensionArterialModel.fetchAll(searchValues, paciente_id, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página de tensiones arteriales solicitada no existe.');
			}

			let query = '';

			if (fechaInicio) {
				query += `&fechaInicio=${fechaInicio}`;
			}

			if (fechaFin) {
				query += `&fechaFin=${fechaFin}`;
			}

			const prev =
				page > 1
					? `/tensionArterial/${paciente_id}?page=${page - 1}&limit=${limit}${query}`
					: null;
			const next =
				page < paginas_totales
					? `/tensionArterial/${paciente_id}?page=${page + 1}&limit=${limit}${query}`
					: null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const fecha_inicio = tz(fechaInicio, 'Europe/Madrid').format('DD-MM-YYYY');
			const fecha_fin = tz(fechaFin, 'Europe/Madrid').format('DD-MM-YYYY');
			const items_pagina = parseInt(limit);

			return {
				prev,
				next,
				result_min,
				result_max,
				cantidad_tensionArterial,
				items_pagina,
				pagina_actual,
				paginas_totales,
				resultados,
				fecha_inicio,
				fecha_fin,
			};
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method createTensionArterial
	 * @description Método para crear una nueva tensión arterial.
	 * @static
	 * @async
	 * @memberof TensionArterialService
	 * @param {number} pacienteId - El ID del paciente.
	 * @param {Object} data - El objeto de la nueva tensión arterial.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva tensión arterial creada.
	 */
	static async createTensionArterial(pacienteId, data, conn = dbConn) {
		try {
			const tensionArterial = ObjectFactory.createTensionArterialObject(data);

			return await TensionArterialModel.create(pacienteId, tensionArterial, conn);
		} catch (err) {
			throw err;
		}
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
