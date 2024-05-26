// Importación de los servicios necesarios
import MedicamentoService from '../services/medicamento.service.js';

// Importación de las librerías necesarias
import {getSearchValues} from "../util/functions/getSearchValues.js";

/**
 * @class MedicamentoController
 * @description Clase estática que implementa la lógica de los medicamentos de la aplicación.
 */
class MedicamentoController {
	/**
	 * @name getMedicamentosPrescripcion
	 * @description Método asíncrono que obtiene medicamentos de prescripción de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los medicamentos.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof MedicamentoController
	 */
	static async getMedicamentosPrescripcion(req, res) {
		try {
			const medicamentos = await MedicamentoService.readMedicamentosPrescripcion();

			return res.status(200).json(medicamentos);
		} catch (err) {
			if (err.message === 'No se encontraron medicamentos.') {
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
	 * @name getMedicamentos
	 * @description Método asíncrono que obtiene medicamentos de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
	 *              la página actual, el total de páginas, el total de medicamentos, el rango de resultados,
	 *              los elementos por página y los medicamentos.
	 *              Si la página solicitada no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof MedicamentoController
	 */
	static async getMedicamentos(req, res) {
		try {
			const searchValues = getSearchValues(req, 'search');
			const medicamentos = await MedicamentoService.readMedicamentos(searchValues);


			return res.status(200).json({
				prev: medicamentos.prev,
				next: medicamentos.next,
				pagina_actual: medicamentos.pagina_actual,
				paginas_totales: medicamentos.paginas_totales,
				cantidad_medicamentos: medicamentos.cantidad_medicamentos,
				items_pagina: medicamentos.items_pagina,
				result_min: medicamentos.result_min,
				result_max: medicamentos.result_max,
				resultados: medicamentos.resultados,
			});
		} catch (err) {
			if (err.message === 'Página no encontrada.') {
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
	 * @name getMedicamentoById
	 * @description Método asíncrono que obtiene un medicamento específico de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del medicamento.
	 *              Si el medicamento no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof MedicamentoController
	 */
	static async getMedicamentoById(req, res) {
		const id = parseInt(req.params.medicamento_id);

		try {
			const medicamento = await MedicamentoService.readMedicamentoById(id);

			if (!medicamento) {
				return res.status(404).json({
					errors: ['El medicamento no existe.'],
				});
			}

			return res.status(200).json(medicamento);
		} catch (err) {
			if (err.message === 'El medicamento no existe.') {
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
	 * @name createMedicamento
	 * @description Método asíncrono que crea un nuevo medicamento en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el medicamento ya existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof MedicamentoController
	 */
	static async createMedicamento(req, res) {
		try {
			await MedicamentoService.createMedicamento(req.body);

			return res.status(200).json({ message: 'Medicamento creado.' });
		} catch (err) {
			if (err.message === 'Ya existe un medicamento con ese nombre.') {
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
	 * @name updateMedicamento
	 * @description Método asíncrono que actualiza un medicamento específico en la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el medicamento no existe, devuelve un error con el mensaje correspondiente.
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof MedicamentoController
	 */
	static async updateMedicamento(req, res) {
		const id = parseInt(req.params.medicamento_id);

		try {
			await MedicamentoService.updateMedicamento(id, req.body);

			return res.status(200).json({ message: 'Medicamento actualizado.' });
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación del controlador
export default MedicamentoController;
