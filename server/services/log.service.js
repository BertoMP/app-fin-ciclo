// Importación del modelo del servicio
import LogModel from '../models/log.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import pkg from 'moment-timezone';
const { tz } = pkg;

/**
 * @class LogService
 * @description Clase que contiene los métodos para interactuar con el modelo de Log.
 */
class LogService {
	/**
	 * @method readLogs
	 * @description Método para leer los logs de la base de datos.
	 * @static
	 * @async
	 * @memberof LogService
	 * @param {Object} searchParams - Los parámetros de búsqueda.
	 * @param conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de lectura.
	 */
	static async readLogs(searchParams, conn = dbConn) {
		try {
			const page = searchParams.page;
			const fechaInicio = searchParams.fechaInicio;
			const fechaFin = searchParams.fechaFin;
			const limit = searchParams.limit;

			const {
				results: resultados,
				actualPage: pagina_actual,
				total: cantidad_logs,
				totalPages: paginas_totales,
			} = await LogModel.fetchAll(searchParams, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página de logs solicitada no existe.');
			}

			let query = '';

			if (fechaInicio) {
				query += `&fechaInicio=${fechaInicio}`;
			}

			if (fechaFin) {
				query += `&fechaFin=${fechaFin}`;
			}

			const prev = pagina_actual > 1 ? `?page=${pagina_actual - 1}${query}` : null;
			const next = pagina_actual < paginas_totales ? `?page=${pagina_actual + 1}${query}` : null;
			const result_min = (pagina_actual - 1) * limit + 1;
			const result_max = pagina_actual * limit > cantidad_logs ? cantidad_logs : pagina_actual * limit;
			const fecha_inicio = tz(fechaInicio, 'Europe/Madrid').format('DD-MM-YYYY');
			const fecha_fin = tz(fechaFin, 'Europe/Madrid').format('DD-MM-YYYY');
			const items_pagina = parseInt(limit);

			return {
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_logs,
				result_min,
				result_max,
				items_pagina,
				fecha_inicio,
				fecha_fin,
				resultados,
			};
		} catch (err) {
			throw err;
		}
	}
}

// Exportación del servicio
export default LogService;
