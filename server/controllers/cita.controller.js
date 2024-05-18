// Importaciones de los servicios necesarios
import CitaService from '../services/cita.service.js';
import EspecialistaService from '../services/especialista.service.js';

// Importación de las funciones necesarias
import {getSearchValues} from "../util/functions/getSearchValues.js";
import PdfService from "../services/pdf.service.js";

/**
 * @class CitaController
 * @description Clase estática que implementa la lógica de las citas de la aplicación.
 */
class CitaController {
	/**
	 * @name getCitas
	 * @description Método asíncrono que obtiene citas de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
	 *              la página actual, el total de páginas, el total de citas, el rango de resultados,
	 *              la fecha de inicio, la fecha de fin, los elementos por página y las citas.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof CitaController
	 */
	static async getCitas(req, res) {
		try {
			const searchValues = getSearchValues(req, 'medicalDateList');
			const citas = await CitaService.readCitas(req.user_id, searchValues);

			return res.status(200).json({
				prev: citas.prev,
				next: citas.next,
				pagina_actual: citas.pagina_actual,
				paginas_totales: citas.paginas_totales,
				cantidad_citas: citas.cantidad_citas,
				result_min: citas.result_min,
				result_max:citas.result_max,
				fecha_inicio: citas.fecha_inicio,
				fecha_fin: citas.fecha_fin,
				items_pagina: citas.items_pagina,
				citas: citas.resultados,
			});
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getCitaById
	 * @description Método asíncrono que obtiene una cita específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de la cita.
	 *              Si la cita no existe o el usuario no tiene permiso para obtenerla, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof CitaController
	 */
	static async getCitaById(req, res) {
		const citaId = req.params.cita_id;
		const userId = req.user_id;

		try {
			const cita = await CitaService.readCitaById(citaId, userId);

			return res.status(200).json(cita);
		} catch (err) {
			if (err.message === 'No tienes permiso para acceder a esta cita.') {
				return res.status(403).json({
					errors: [err.message],
				});
			}

			if (err.message === 'La cita que intenta obtener no existe.') {
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
	 * @name getCitasDisponibles
	 * @description Método asíncrono que obtiene citas disponibles de la base de datos.
	 * 						  Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas
	 * 						  anterior y siguiente, la página actual, el total de páginas, el total de citas,
	 * 						  el rango de resultados, la fecha de la cita, el ID del especialista y las citas disponibles.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof CitaController
	 */
	static async getCitasDisponibles(req, res) {
		const searchValues = getSearchValues(req, 'medicalDate');

		try {
			const citasDisponibles = await CitaService.readCitasDisponibles(searchValues);

			return res.status(200).json({
				prev: citasDisponibles.prev,
				next: citasDisponibles.next,
				pagina_actual: citasDisponibles.pagina_actual,
				paginas_totales: citasDisponibles.paginas_totales,
				cantidad_citas: citasDisponibles.cantidad_citas,
				result_min: citasDisponibles.result_min,
				result_max: citasDisponibles.result_max,
				items_pagina: citasDisponibles.items_pagina,
				datos_agenda: {
					fecha_cita: citasDisponibles.fecha_cita,
					especialista_id: citasDisponibles.especialista_id,
					citas_disponibles: citasDisponibles.resultados
				}
			});
		} catch (err) {
			if (err.message === 'El especialista seleccionado no existe.') {
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
	 * @name getCitaPdf
	 * @description Método asíncrono que obtiene un archivo PDF de una cita específica de la base de datos utilizando su ID.
	 * 						Devuelve un archivo PDF con los datos de la cita.
	 * 						Si la cita no existe o el usuario no tiene permiso para obtenerla, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof CitaController
	 */
	static async getCitaPdf(req, res) {
		const citaId = req.params.cita_id;
		const userId = req.user_id;

		let file;

		try {
			file = await CitaService.printCitaPDF(userId, citaId);

			res.status(200).download(file, async (err) => {
				await PdfService.destroyPDF(file);
				if (err) {
					console.error('Error al descargar el archivo:', err);
				}
			});
		} catch (err) {
			if (file) {
				await PdfService.destroyPDF(file);
			}

			if (err.message === 'La cita que intenta obtener no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			if (err.message === 'No tienes permiso para acceder a esta cita.') {
				return res.status(403).json({
					errors: [err.message],
				});
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getCitasAgenda
	 * @description Método asíncrono que obtiene las citas de la agenda de un especialista específico de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de las citas.
	 *              Si no hay citas disponibles, devuelve un error con el mensaje correspondiente.
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof CitaController
	 */
	static async getCitasAgenda(req, res) {
		const especialista_id = req.user_id;

		try {
			const citas = await CitaService.readCitasAgenda(especialista_id);

			return res.status(200).json(citas);
		} catch (err) {
			if (err.message === 'No hay citas disponibles.') {
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
	 * @name createCita
	 * @description Método asíncrono que crea una nueva cita en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la cita ya existe, el especialista seleccionado no existe, o el especialista no trabaja en el horario seleccionado,
	 *              devuelve un error con el mensaje correspondiente.
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof CitaController
	 */
	static async createCita(req, res) {
		const cita = {
			paciente_id: req.user_id,
			especialista_id: req.body.especialista_id,
			fecha: req.body.fecha,
			hora: req.body.hora,
		};

		try {
			await CitaService.createCita(cita);

			return res.status(200).json({
				message: 'Cita creada correctamente.',
			});
		} catch (err) {
			if (err.message === 'La cita que intenta crear no está disponible.') {
				return res.status(409).json({
					errors: [err.message],
				});
			}

			if (err.message === 'Ya tienes una cita asignada a esa hora con otro especialista.') {
				return res.status(409).json({
					errors: [err.message],
				})
			}

			if (err.message === 'El especialista seleccionado no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			if (err.message === 'El especialista no trabaja en el horario seleccionado.') {
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
	 * @name deleteCita
	 * @description Método asíncrono que elimina una cita específica de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si la cita no existe o el usuario no tiene permiso para eliminarla, devuelve un error con el mensaje correspondiente.
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof CitaController
	 */
	static async deleteCita(req, res) {
		const citaId = req.params.cita_id;
		const userId = req.user_id;

		try {
			await CitaService.deleteCita(citaId, userId);

			return res.status(200).json({
				message: 'Cita eliminada correctamente.',
			});
		} catch (err) {
			if (err.message === 'La cita que intenta eliminar no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			if (err.message === 'No tienes permiso para eliminar esta cita.') {
				return res.status(403).json({
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
export default CitaController;
