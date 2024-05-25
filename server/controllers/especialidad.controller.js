// Importación de los servicios necesarios
import EspecialidadService from '../services/especialidad.service.js';

// Importación de las librerías necesarias
import {getSearchValues} from "../util/functions/getSearchValues.js";

/**
 * @class EspecialidadController
 * @description Clase estática que implementa la lógica de las especialidades de la aplicación.
 */
class EspecialidadController {
	/**
	 * @name getEspecialidades
	 * @description Método asíncrono que obtiene especialidades de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
	 *              la página actual, el total de páginas, el total de especialidades, el rango de resultados,
	 *              y las especialidades.
	 *              Si la página solicitada no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof EspecialidadController
	 */
	static async getEspecialidades(req, res) {
		try {
			const searchValues = getSearchValues(req, 'search');
			const especialidades = await EspecialidadService.readEspecialidades(searchValues);

			return res.status(200).json({
				prev: especialidades.prev,
				next: especialidades.next,
				pagina_actual: especialidades.pagina_actual,
				paginas_totales: especialidades.paginas_totales,
				cantidad_especialidades: especialidades.cantidad_especialidades,
				items_pagina: especialidades.items_pagina,
				result_min: especialidades.result_min,
				result_max: especialidades.result_max,
				resultados: especialidades.resultados,
			});
		} catch (err) {
			if (err.message === 'La página solicitada no existe.') {
				return res.status(404).json({ errors: [err.message] });
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getEspecialidadesListado
	 * @description Método asíncrono que obtiene todas las especialidades en formato de listado de la base de datos.
	 * 						  Devuelve un objeto JSON con la respuesta HTTP que incluye las especialidades.
	 * 						  Si no hay especialidades, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof EspecialidadController
	 */
	static async getEspecialidadesListado(req, res) {
		try {
			const especialidades = await EspecialidadService.readEspecialidadesListado();

			return res.status(200).json(especialidades);
		} catch (err) {
			if (err.message === 'No se encontraron especialidades.') {
				return res.status(404).json({ errors: [err.message] });
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getEspecialidadById
	 * @description Método asíncrono que obtiene una especialidad específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de la especialidad.
	 *              Si la especialidad no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof EspecialidadController
	 */
	static async getEspecialidadById(req, res) {
		const id = parseInt(req.params.especialidad_id);

		try {
			const especialidad = await EspecialidadService.readEspecialidadById(id);

			return res.status(200).json(especialidad);
		} catch (err) {
			if (err.message === 'Especialidad no encontrada.') {
				return res.status(404).json({ errors: [err.message] });
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getEspecialidadesEspecialistas
	 * @description Método asíncrono que obtiene las especialidades con especialistas de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de las especialidades.
	 *              Si no hay especialidades con especialistas, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof EspecialidadController
	 */
	static async getEspecialidadesEspecialistas(req, res) {
		try {
			const especialidades = await EspecialidadService.readEspecialidesEspecialistas();

			return res.status(200).json(especialidades);
		} catch (err) {
			if (err.message === 'No se encontraron especialidades con especialistas.') {
				return res.status(404).json({ errors: [err.message] });
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name createEspecialidad
	 * @description Método asíncrono que crea una nueva especialidad en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la especialidad ya existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof EspecialidadController
	 */
	static async createEspecialidad(req, res) {
		try {
			await EspecialidadService.createEspecialidad(req.body);

			return res.status(200).json({ message: 'Especialidad creada exitosamente.' });
		} catch (err) {
			if (err.message === 'Ya existe una especialidad con ese nombre.') {
				return res.status(409).json({ errors: [err.message] });
			}

			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name updateEspecialidad
	 * @description Método asíncrono que actualiza una especialidad existente en la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la especialidad no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof EspecialidadController
	 */
	static async updateEspecialidad(req, res) {
		const id = parseInt(req.params.especialidad_id);

		try {
			await EspecialidadService.updateEspecialidad(id, req.body);

			return res.status(200).json({ message: 'Especialidad actualizada exitosamente.' });
		} catch (err) {
			if (err.message === 'Especialidad no encontrada.') {
				return res.status(404).json({ errors: [err.message] });
			}

			if (err.message === 'Ya existe una especialidad con ese nombre.') {
				return res.status(409).json({ errors: [err.message] });
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name deleteEspecialidad
	 * @description Método asíncrono que elimina una especialidad específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la especialidad no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof EspecialidadController
	 */
	static async deleteEspecialidad(req, res) {
		const id = parseInt(req.params.especialidad_id);

		try {
			await EspecialidadService.deleteEspecialidad(id);

			return res.status(200).json({
				message: 'Especialidad eliminada exitosamente.',
			});
		} catch (err) {
			if (err.message === 'Especialidad no encontrada.') {
				return res.status(404).json({
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
export default EspecialidadController;
