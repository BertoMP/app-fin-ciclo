// Importación de los servicios necesarios
import TensionArterialService from '../services/tensionArterial.service.js';

// Importación de las librerías necesarias
import pkg from 'moment-timezone';
const { tz } = pkg;

// Importación de las funciones necesarias
import {getSearchValues} from "../util/functions/getSearchValues.js";

/**
 * @class TensionArterialController
 * @description Clase estática que implementa la lógica de las tensiones arteriales de la aplicación.
 */
class TensionArterialController {
	/**
	 * @name getTensionArterial
	 * @description Método asíncrono que obtiene las tensiones arteriales de un paciente de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
	 *              la página actual, el total de páginas, el total de tensiones arteriales, el rango de resultados,
	 *              la fecha de inicio, la fecha de fin, los elementos por página y las tensiones arteriales.
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof TensionArterialController
	 */
	static async getTensionArterial(req, res) {
		let paciente_id = 0;

		if (req.user_role === 2) {
			paciente_id = req.user_id;
		} else if (req.user_role === 3) {
			paciente_id = req.params.usuario_id;
		}

		try {
			const searchValues = getSearchValues(req, 'date');
			const mediciones = await TensionArterialService.readTensionArterial(searchValues, paciente_id);

			return res.status(200).json({
				prev: mediciones.prev,
				next: mediciones.next,
				pagina_actual: mediciones.pagina_actual,
				paginas_totales: mediciones.paginas_totales,
				cantidad_mediciones: mediciones.cantidad_tensionArterial,
				result_min: mediciones.result_min,
				result_max: mediciones.result_max,
				fecha_inicio: mediciones.fecha_inicio,
				fecha_fin: mediciones.fecha_fin,
				items_pagina: mediciones.items_pagina,
				mediciones: mediciones.resultados,
			});
		} catch (error) {
			return res.status(500).json({
				errors: [error.message],
			});
		}
	}

	/**
	 * @name postTensionArterial
	 * @description Método asíncrono que registra una nueva tensión arterial en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof TensionArterialController
	 */
	static async postTensionArterial(req, res) {
		const paciente_id = req.user_id;

		try {
			await TensionArterialService.createTensionArterial(paciente_id, req.body);

			return res.status(200).json({ message: 'Tensión arterial registrada correctamente.' });
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación del controlador
export default TensionArterialController;
