// Importación de los servicios necesarios
import PatologiaService from '../services/patologia.service.js';

// Importación de las funciones necesarias
import { getSearchValues } from "../util/functions/getSearchValues.js";
import {sanitizeInput} from "../util/functions/sanitizeInput.js";

/**
 * @class PatologiaController
 * @description Clase estática que implementa la lógica de las patologías de la aplicación.
 */
class PatologiaController {
	/**
	 * @name getPatologiasInforme
	 * @description Método asíncrono que obtiene patologías de la base de datos para un informe.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de las patologías.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PatologiaController
	 */
	static async getPatologiasInforme(req, res) {
		try {
			const patologias = await PatologiaService.readPatologiasInforme();

			return res.status(200).json(patologias);
		} catch (err) {
			if (err.message === 'No se encontraron patologías para el informe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getPatologias
	 * @description Método asíncrono que obtiene patologías de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
	 *              la página actual, el total de páginas, el total de patologías, el rango de resultados y las patologías.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PatologiaController
	 */
	static async getPatologias(req, res) {
		try {
			const searchValues = getSearchValues(req, 'search');
			const patologias = await PatologiaService.readPatologias(searchValues);

			return res.status(200).json({
				prev: patologias.prev,
				next: patologias.next,
				pagina_actual: patologias.pagina_actual,
				paginas_totales: patologias.paginas_totales,
				cantidad_patologias: patologias.cantidad_patologias,
				result_min: patologias.result_min,
				result_max: patologias.result_max,
				items_pagina: patologias.items_pagina,
				resultados: patologias.resultados,
			});
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getPatologiaById
	 * @description Método asíncrono que obtiene una patología específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de la patología.
	 *              Si la patología no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PatologiaController
	 */
	static async getPatologiaById(req, res) {
		const id = parseInt(req.params.patologia_id);

		try {
			const patologia = await PatologiaService.readPatologiaById(id);

			return res.status(200).json(patologia);
		} catch (err) {
			if (err.message === 'La patología solicitada no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name createPatologia
	 * @description Método asíncrono que crea una nueva patología en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la patología ya existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PatologiaController
	 */
	static async createPatologia(req, res) {
		try {
			await PatologiaService.createPatologia(req.body);

			return res.status(200).json({
				message: 'Patología creada correctamente.',
			});
		} catch (err) {
			if (err.message === 'La patología ya existe.') {
				return res.status(409).json({
					errors: [err.message],
				});
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name updatePatologia
	 * @description Método asíncrono que actualiza una patología específica en la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la patología no existe o ya existe una patología con el mismo nombre, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PatologiaController
	 */
	static async updatePatologia(req, res) {
		const id = parseInt(req.params.patologia_id);

		try {
			await PatologiaService.updatePatologia(id, req.body);

			return res.status(200).json({
				message: 'Patología actualizada correctamente.',
			});
		} catch (err) {
			if (err.message === 'La patología solicitada no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			if (err.message === 'Ya existe una patología con el mismo nombre.') {
				return res.status(409).json({
					errors: [err.message],
				});
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación del controlador
export default PatologiaController;
