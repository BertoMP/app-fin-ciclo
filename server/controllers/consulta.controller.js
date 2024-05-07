// Importación de los servicios necesarios
import ConsultaService from '../services/consulta.service.js';
import EspecialistaService from '../services/especialista.service.js';
import {getSearchValues} from "../util/functions/getSearchValues.js";
import ObjectFactory from "../util/classes/objectFactory.js";

/**
 * @class ConsultaController
 * @description Clase estática que implementa la lógica de las consultas de la aplicación.
 */
class ConsultaController {
	/**
	 * @name getConsultas
	 * @description Método asíncrono que obtiene consultas de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
	 *              la página actual, el total de páginas, el total de consultas, el rango de resultados,
	 *              y las consultas.
	 *              Si la página solicitada no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof ConsultaController
	 */
	static async getConsultas(req, res) {
		try {
			const searchValues = getSearchValues(req, 'search');
			const consultas = await ConsultaService.readConsultas(searchValues);

			return res.status(200).json({
				prev: consultas.prev,
				next: consultas.next,
				pagina_actual: consultas.pagina_actual,
				paginas_totales: consultas.paginas_totales,
				cantidad_consultas: consultas.cantidad_consultas,
				items_pagina: consultas.items_pagina,
				result_min: consultas.result_min,
				result_max: consultas.result_max,
				resultados: consultas.resultados,
			});
		} catch (err) {
			if (err.message === 'La página solicitada no existe.') {
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
	 * @name getConsultaListado
	 * @description Método asíncrono que obtiene una lista de consultas de la base de datos.
	 * 						Devuelve un objeto JSON con la respuesta HTTP que incluye las consultas.
	 * 						Si no hay consultas, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 */
	static async getConsultaListado(req, res) {
		try {
			const consultas = await ConsultaService.readConsultasListado();

			return res.status(200).json(consultas);
		} catch (err) {
			if (err.message === 'No se encontraron consultas.') {
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
	 * @name getConsultaById
	 * @description Método asíncrono que obtiene una consulta específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de la consulta.
	 *              Si la consulta no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof ConsultaController
	 */
	static async getConsultaById(req, res) {
		const id = parseInt(req.params.consulta_id);

		try {
			const consulta = await ConsultaService.readConsultaById(id);

			return res.status(200).json(consulta);
		} catch (err) {
			if (err.message === 'Consulta no encontrada.') {
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
	 * @name createConsulta
	 * @description Método asíncrono que crea una nueva consulta en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la consulta ya existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof ConsultaController
	 */
	static async createConsulta(req, res) {
		try {
			await ConsultaService.createConsulta(req.body);

			return res.status(200).json({
				message: 'Consulta creada correctamente.',
			});
		} catch (err) {
			if (err.message === 'La consulta ya existe.') {
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
	 * @name updateConsulta
	 * @description Método asíncrono que actualiza una consulta existente en la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la consulta no existe o ya existe una consulta con el mismo nombre, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof ConsultaController
	 */
	static async updateConsulta(req, res) {
		const id = parseInt(req.params.consulta_id);

		try {
			await ConsultaService.updateConsulta(id, req.body);

			return res.status(200).json({
				message: 'Consulta actualizada correctamente.',
			});
		} catch (err) {
			if (err.message === 'La consulta no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			if (err.message === 'Ya existe una consulta con ese nombre.') {
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
	 * @name deleteConsulta
	 * @description Método asíncrono que elimina una consulta específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la consulta no existe o está asociada a un médico, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof ConsultaController
	 */
	static async deleteConsulta(req, res) {
		const id = parseInt(req.params.consulta_id);

		try {
			await ConsultaService.deleteConsulta(id);

			return res.status(200).json({
				message: 'Consulta eliminada correctamente.',
			});
		} catch (err) {
			if (err.message === 'La consulta no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			if (err.message === 'No se puede eliminar la consulta porque está asociada a un médico.') {
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
export default ConsultaController;
