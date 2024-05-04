// Importación de los servicios necesarios
import MedicamentoService from '../services/medicamento.service.js';
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
			const page = searchValues.page;
			const limit = searchValues.limit;
			const search = searchValues.search;

			const {
				rows: resultados,
				actualPage: pagina_actual,
				total: cantidad_medicamentos,
				totalPages: paginas_totales,
			} = await MedicamentoService.readMedicamentos(searchValues);

			if (page > 1 && page > paginas_totales) {
				return res.status(404).json({
					errors: ['La página de medicamentos solicitada no existe.'],
				});
			}

			let query = '';

			if (search) {
				query += `&search=${search}`;
			}

			const prev = page > 1 ? `/medicamento?page=${page - 1}&limit=${limit}${query}` : null;
			const next = page < paginas_totales ? `/medicamento?page=${page + 1}&limit=${limit}${query}` : null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const items_pagina = parseInt(limit);

			return res.status(200).json({
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_medicamentos,
				items_pagina,
				result_min,
				result_max,
				resultados,
			});
		} catch (err) {
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
		let descripcion = req.body.descripcion;
		descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

		const medicamento = {
			nombre: req.body.nombre,
			descripcion: descripcion,
		};

		try {
			const medicamentoExists = await MedicamentoService.readMedicamentoByNombre(
				medicamento.nombre,
			);

			if (medicamentoExists) {
				return res.status(409).json({
					errors: ['El medicamento ya existe.'],
				});
			}

			await MedicamentoService.createMedicamento(medicamento);

			return res.status(200).json({ message: 'Medicamento creado.' });
		} catch (err) {
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

		let descripcion = req.body.descripcion;
		descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

		const medicamento = {
			nombre: req.body.nombre,
			descripcion: descripcion,
		};

		try {
			const currentMedicamento = await MedicamentoService.readMedicamentoById(id);

			if (!currentMedicamento) {
				return res.status(404).json({
					errors: ['El medicamento no existe.'],
				});
			}

			await MedicamentoService.updateMedicamento(id, medicamento);

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
