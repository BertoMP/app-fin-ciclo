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

			const page = searchValues.page;
			const fechaInicio = searchValues.fechaInicio;
			const fechaFin = searchValues.fechaFin;
			const limit = searchValues.limit;

			const {
				rows: resultados,
				total: cantidad_tensionArterial,
				actualPage: pagina_actual,
				totalPages: paginas_totales,
			} = await TensionArterialService.readTensionArterial(searchValues, paciente_id);

			if (page > 1 && page > paginas_totales) {
				return res.status(404).json({
					errors: ['La página de tensiones arteriales solicitada no existe.'],
				});
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
			const fecha_inicio = fechaInicio;
			const fecha_fin = fechaFin;
			const items_pagina = parseInt(limit);

			return res.status(200).json({
				prev,
				next,
				result_min,
				result_max,
				cantidad_tensionArterial,
				items_pagina,
				pagina_actual,
				paginas_totales,
				fecha_inicio,
				fecha_fin,
				resultados,
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
		const fecha = tz(new Date(), 'Europe/Madrid').format('YYYY-MM-DD');
		const hora = tz(new Date(), 'Europe/Madrid').format('HH:mm:ss');
		const paciente_id = req.body.user_id;
		const sistolica = parseInt(req.body.sistolica);
		const diastolica = parseInt(req.body.diastolica);
		const pulsaciones = parseInt(req.body.pulsaciones);

		const tensionArterial = {
			paciente_id: paciente_id,
			sistolica: sistolica,
			diastolica: diastolica,
			pulsaciones: pulsaciones,
			fecha: fecha,
			hora: hora,
		};

		try {
			await TensionArterialService.createTensionArterial(tensionArterial);

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
