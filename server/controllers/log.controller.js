// Importación de los servicios necesarios
import LogService from '../services/log.service.js';

// Importación de las librerías necesarias
import { getSearchValues } from '../util/functions/getSearchValues.js';

/**
 * @class LogController
 * @description Clase estática que implementa la lógica de los logs de la aplicación.
 */
class LogController {
	/**
	 * @name getLogs
	 * @description Método asíncrono que obtiene todos los logs de la base de datos.
	 * 						Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los logs.
	 * 						Si ocurre algún error durante el proceso, devuelve un error con el mensaje correspondiente.
	 * 						Se utiliza el servicio de logs para obtener los datos de los logs.
	 * @static
	 * @async
	 * @function
	 * @param req - El objeto de solicitud de Express.
	 * @param res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof LogController
	 */
	static async getLogs(req, res) {
		try {
			const searchParams = getSearchValues(req, 'date');
			const logs = await LogService.readLogs(searchParams);

			return res.status(200).json({
				prev: logs.prev,
				next: logs.next,
				pagina_actual: logs.pagina_actual,
				paginas_totales: logs.paginas_totales,
				cantidad_logs: logs.cantidad_logs,
				result_min: logs.result_min,
				result_max: logs.result_max,
				items_pagina: logs.items_pagina,
				fecha_inicio: logs.fecha_inicio,
				fecha_fin: logs.fecha_fin,
				resultados: logs.resultados,
			});
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación de la clase LogController
export default LogController;
