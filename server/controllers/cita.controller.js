// Importaciones de los servicios necesarios
import CitaService from '../services/cita.service.js';
import EspecialistaService from '../services/especialista.service.js';

// Importación de las funciones necesarias
import { getSearchValuesByDate } from '../util/functions/getSearchValuesByDate.js';

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
		const limit = 10;

		try {
			const searchValues = getSearchValuesByDate(req, true);

			const page = searchValues.page;
			const fechaInicio = searchValues.fechaInicio;
			const fechaFin = searchValues.fechaFin;
			const paciente_id = searchValues.paciente_id;

			const {
				rows: resultados,
				actualPage: pagina_actual,
				total: cantidad_citas,
				totalPages: paginas_totales,
			} = await CitaService.readCitas(searchValues, limit);

			if (page > 1 && page > paginas_totales) {
				return res.status(404).json({
					errors: ['La página de citas solicitada no existe.'],
				});
			}

			const prev =
				page > 1
					? `/cita/${paciente_id}?page=${page - 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
					: null;
			const next =
				page < paginas_totales
					? `/cita/${paciente_id}?page=${page + 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
					: null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados[0].citas.length === limit
					? page * limit
					: (page - 1) * limit + resultados[0].citas.length;
			const fecha_inicio = fechaInicio;
			const fecha_fin = fechaFin;
			const items_pagina = limit;

			return res.status(200).json({
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_citas,
				result_min,
				result_max,
				items_pagina,
				fecha_inicio,
				fecha_fin,
				resultados,
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
			const cita = await CitaService.readCitaById(citaId);

			if (!cita) {
				return res.status(404).json({
					errors: ['La cita que intenta obtener no existe.'],
				});
			}

			if (cita.datos_paciente.paciente_id !== userId) {
				return res.status(403).json({
					errors: ['No tienes permiso para obtener esta cita.'],
				});
			}

			return res.status(200).json(cita);
		} catch (err) {
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

			if (!citas || citas.length === 0) {
				return res.status(404).json({
					errors: ['No hay citas disponibles.'],
				});
			}

			return res.status(200).json(citas);
		} catch (err) {
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
			const citaExists = await CitaService.readCitaByData(cita);

			if (citaExists) {
				return res.status(404).json({
					errors: ['La cita que intenta crear no esta disponible.'],
				});
			}

			const especialista = await EspecialistaService.readEspecialistaByEspecialistaId(
				cita.especialista_id,
			);

			if (!especialista) {
				return res.status(404).json({
					errors: ['El especialista seleccionado no existe.'],
				});
			}

			const citaHora = new Date(`1970-01-01T${cita.hora}Z`);

			const diurnoInicio = new Date('1970-01-01T08:00:00Z');
			const diurnoFin = new Date('1970-01-01T14:00:00Z');

			const vespertinoInicio = new Date('1970-01-01T14:30:00Z');
			const vespertinoFin = new Date('1970-01-01T20:00:00Z');

			if (
				especialista.turno === 'no-trabajando' ||
				(especialista.turno === 'diurno' && (citaHora < diurnoInicio || citaHora > diurnoFin)) ||
				(especialista.turno === 'vespertino' &&
					(citaHora < vespertinoInicio || citaHora > vespertinoFin))
			) {
				return res.status(404).json({
					errors: ['El especialista no trabaja en el horario seleccionado.'],
				});
			}

			await CitaService.createCita(cita);

			return res.status(200).json({
				message: 'Cita creada correctamente.',
			});
		} catch (err) {
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
			const cita = await CitaService.readCitaById(citaId);

			if (!cita) {
				return res.status(404).json({
					errors: ['La cita que intenta eliminar no existe.'],
				});
			}

			if (cita.datos_paciente.paciente_id !== userId) {
				return res.status(403).json({
					errors: ['No tienes permiso para eliminar esta cita.'],
				});
			}

			await CitaService.deleteCita(citaId);

			return res.status(200).json({
				message: 'Cita eliminada correctamente.',
			});
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación del controlador
export default CitaController;
