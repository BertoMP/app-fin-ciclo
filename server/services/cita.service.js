// Importación del modelo asociado al servicio
import CitaModel from '../models/cita.model.js';

// Importación de servicios auxiliares
import UsuarioService from './usuario.service.js';
import PdfService from './pdf.service.js';
import EmailService from './email.service.js';
import EspecialistaService from "./especialista.service.js";

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import { generateQRCode } from '../util/functions/createQr.js';
import pkg from 'moment-timezone';
const { tz } = pkg;

/**
 * @class CitaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Cita.
 */
class CitaService {
	/**
	 * @method readCitas
	 * @description Método para leer citas.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de citas.
	 */
	static async readCitas(userId, searchValues, conn = dbConn) {
		try {
			const page = searchValues.page;
			const fechaInicioCita = searchValues.fechaInicioCita;
			const fechaFinCita = searchValues.fechaFinCita;
			const limit = searchValues.limit;

			const {
				rows: resultados,
				actualPage: pagina_actual,
				total: cantidad_citas,
				totalPages: paginas_totales,
			} = await CitaModel.fetchAll(userId, searchValues, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página de citas solicitada no existe.');
			}

			let query = '';

			if (fechaInicioCita) {
				query += `&fechaInicio=${fechaInicioCita}`;
			}

			if (fechaFinCita) {
				query += `&fechaFin=${fechaFinCita}`;
			}

			const prev =
				page > 1
					? `/cita?page=${page - 1}&limit=${limit}${query}`
					: null;
			const next =
				page < paginas_totales
					? `/cita?page=${page + 1}&limit=${limit}${query}`
					: null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados[0].citas.length === limit
					? page * limit
					: (page - 1) * limit + resultados[0].citas.length;
			const fecha_inicio = tz(fechaInicioCita, 'Europe/Madrid').format('DD-MM-YYYY');
			const fecha_fin = tz(fechaFinCita, 'Europe/Madrid').format('DD-MM-YYYY');
			const items_pagina = parseInt(limit);

			return {
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
			};
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readCitasDisponibles
	 * @description Método para leer citas disponibles.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de citas.
	 * @throws {Error} Si ocurre algún error durante el proceso, lanza un error.
	 * @throws {Error} Si el especialista seleccionado no existe, lanza un error.
	 * @throws {Error} Si la página de citas solicitada no existe, lanza un error.
	 */
	static async readCitasDisponibles(searchValues, conn = dbConn) {
		const page = searchValues.page;
		const fechaCita = searchValues.fechaCita;
		const especialistaId = searchValues.especialistaId;
		const limit = searchValues.limit;

		const especialista = await EspecialistaService.readEspecialistaByEspecialistaId(especialistaId, conn);

		if (!especialista || especialista.turno === 'no-trabajando') {
			throw new Error('El especialista seleccionado no existe.');
		}

		const {
			rows: resultados,
			actualPage: pagina_actual,
			total: cantidad_citas,
			totalPages: paginas_totales,
		} = await CitaModel.fetchAgendaDisponible(searchValues, conn);

		if (page > 1 && page > paginas_totales) {
			throw new Error('La página de citas solicitada no existe.');
		}

		let query = '';

		if (fechaCita) {
			query += `&fechaCita=${fechaCita}`;
		}

		if (especialistaId) {
			query += `especialistaId=${especialistaId}`;
		}

		const prev =
			page > 1
				? `/cita/citas-disponibles?page=${page - 1}&limit=${limit}${query}`
				: null;
		const next =
			page < paginas_totales
				? `/cita/citas-disponibles?page=${page + 1}&limit=${limit}${query}`
				: null;
		const result_min = (page - 1) * limit + 1;
		const result_max =
			resultados.length === limit
				? page * limit
				: (page - 1) * limit + resultados.length;
		const fecha_cita = tz(fechaCita, 'Europe/Madrid').format('YYYY-MM-DD');
		const especialista_id = especialistaId;
		const items_pagina = parseInt(limit);

		return {
			prev,
			next,
			pagina_actual,
			paginas_totales,
			cantidad_citas,
			result_min,
			result_max,
			items_pagina,
			fecha_cita,
			especialista_id,
			resultados,
		};
	}

	/**
	 * @method readCitasByUserId
	 * @description Método para leer citas por el ID del usuario.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de citas.
	 */
	static async readCitasByEspecialistaId(userId, conn = dbConn) {
		return await CitaModel.fetchByEspecialistaId(userId, conn);
	}

	/**
	 * @method readInformesByUserId
	 * @description Método para leer informes por el ID del paciente.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} paciente_id - El ID del paciente.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de informes.
	 */
	static async readInformesByUserId(paciente_id, conn = dbConn) {
		return await CitaModel.getInformesByUserId(paciente_id, conn);
	}

	/**
	 * @method readCitaById
	 * @description Método para leer una cita por su ID.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} id - El ID de la cita.
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la cita.
	 */
	static async readCitaById(id, userId, conn = dbConn) {
		try {
			const cita = await CitaModel.fetchById(id, conn);

			if (!cita) {
				throw new Error('La cita que intenta obtener no existe.');
			}

			if (cita.datos_paciente.paciente_id !== userId) {
				throw new Error('No tiene permiso para obtener esta cita.');
			}

			return cita;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readCitaByData
	 * @description Método para leer una cita por sus datos.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {Object} cita - Los datos de la cita.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la cita.
	 */
	static async readCitaByData(cita, conn = dbConn) {
		return await CitaModel.fetchByData(cita, conn);
	}

	/**
	 * @method readCitasAgenda
	 * @description Método para leer las citas de la agenda de un especialista.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} especialista_id - El ID del especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de citas.
	 */
	static async readCitasAgenda(especialista_id, conn = dbConn) {
		try {
			const citas = await CitaModel.fetchAgenda(especialista_id, conn);

			if (!citas) {
				throw new Error('No hay citas disponibles.');
			}

			return citas;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readPacienteIdByInformeId
	 * @description Método para leer el ID del paciente por el ID del informe.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} informe_id - El ID del informe.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<{paciente_id: *}>} El ID del paciente.
	 */
	static async readPacienteIdByInformeId(informe_id, conn = dbConn) {
		return await CitaModel.fetchPacienteIdByInformeId(informe_id, conn);
	}

	/**
	 * @method createCita
	 * @description Método para crear una cita.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {Object} cita - Los datos de la cita.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<Object>} Un objeto que representa la consulta creada.
	 * @throws {Error} Si ocurre algún error durante el proceso, lanza un error.
	 */
	static async createCita(cita, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		let pdf;

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const citaExists = await CitaModel.fetchByData(cita, conn);

			if (citaExists) {
				throw new Error('La cita que intenta crear no está disponible.');
			}

			const citaPaciente = {
				paciente_id: cita.paciente_id,
				hora: cita.hora,
				fecha: cita.fecha
			}

			const citaExistsPaciente = await CitaModel.fetchByDataPaciente(citaPaciente, conn);

			if (citaExistsPaciente) {
				throw new Error('Ya tienes una cita asignada a esa hora con otro especialista.');
			}

			const especialista = await EspecialistaService.readEspecialistaByEspecialistaId(cita.especialista_id, conn);

			if (!especialista) {
				throw new Error('El especialista seleccionado no existe.');
			}

			const citaHora = new Date(`1970-01-01T${cita.hora}Z`);
			const diurnoInicio = new Date('1970-01-01T08:00:00Z');
			const diurnoFin = new Date('1970-01-01T14:00:00Z');
			const vespertinoInicio = new Date('1970-01-01T16:00:00Z');
			const vespertinoFin = new Date('1970-01-01T22:00:00Z');

			if (
				especialista.turno === 'no-trabajando' ||
				(especialista.turno === 'diurno' && (citaHora < diurnoInicio || citaHora > diurnoFin)) ||
				(especialista.turno === 'vespertino' &&
					(citaHora < vespertinoInicio || citaHora > vespertinoFin))
			) {
				throw new Error('El especialista no trabaja en el horario seleccionado.');
			}

			const newCitaId = await CitaModel.createCita(cita, conn);
			const newCita = await CitaModel.fetchById(newCitaId.id, conn);
			const qr = await generateQRCode(newCita);
			const paciente = await UsuarioService.readEmailByUserId(cita.paciente_id, conn);
			const emailPaciente = paciente.email;

			pdf = await PdfService.generateCitaPDF(newCita, qr);

			await EmailService.sendPdfCita(newCita, emailPaciente, pdf);

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}

			throw err;
		} finally {
			if (pdf) {
				await PdfService.destroyPDF(pdf);
			}

			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method deleteCitasByUserId
	 * @description Método para eliminar citas por el ID del usuario.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa las citas eliminadas.
	 */
	static async deleteCitasByUserId(userId, conn = dbConn) {
		return await CitaModel.deleteCitasByUserId(userId, conn);
	}

	/**
	 * @method deleteCita
	 * @description Método para eliminar una cita por su ID.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} id - El ID de la cita.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la cita eliminada.
	 */
	static async deleteCita(id, conn = dbConn) {
		try {
			const cita = await CitaModel.fetchById(id, conn);

			if (!cita) {
				throw new Error('La cita que intenta eliminar no existe.');
			}

			await CitaModel.deleteCita(id, conn);
			const userMail = (await UsuarioService.readEmailByUserId(cita.datos_paciente.paciente_id, conn)).email;
			await EmailService.sendEmailCitaEliminada(cita, userMail);

			return cita;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method updateInformeId
	 * @description Método para actualizar el ID del informe de una cita.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} cita_id - El ID de la cita.
	 * @param {number} informe_id - El nuevo ID del informe.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa el informe actualizado.
	 */
	static async updateInformeId(cita_id, informe_id, conn = dbConn) {
		return await CitaModel.updateInformeId(cita_id, informe_id, conn);
	}

	/**
	 * @method printCitaPDF
	 * @description Método para imprimir una cita en formato PDF.
	 * @static
	 * @async
	 * @memberOf CitaService
	 * @param {number} userId - El ID del usuario.
	 * @param {number} citaId - El ID de la cita.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa el PDF de la cita.
	 * @throws {Error} Si ocurre algún error durante el proceso, lanza un error.
	 */
	static async printCitaPDF(userId, citaId, conn = dbConn) {
		try {
			const cita = await CitaModel.fetchById(citaId, conn);

			if (!cita) {
				throw new Error('La cita que intenta imprimir no existe.');
			}

			if (cita.datos_paciente.paciente_id !== userId) {
				throw new Error('No tiene permiso para imprimir esta cita.');
			}

			const qr = await generateQRCode(cita);

			return await PdfService.generateCitaPDF(cita, qr);
		} catch (err) {
			throw err;
		}
	}
}

// Exportación del servicio
export default CitaService;
