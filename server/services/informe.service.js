// Importación del modelo del servicio
import InformeModel from '../models/informe.model.js';

// Importación de servicios auxiliares
import PatologiaService from './patologia.service.js';
import InformePatologiaService from './informePatologia.service.js';
import CitaService from './cita.service.js'
import PdfService from "./pdf.service.js";

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";
import pkg from 'moment-timezone';
const { tz } = pkg;


/**
 * @class InformeService
 * @description Clase que contiene los métodos para la gestión de informes.
 */
class InformeService {
	/**
	 * @method readInformes
	 * @description Método para leer todos los informes de un usuario.
	 * @static
	 * @async
	 * @memberof InformeService
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa los informes.
	 * @throws {Error} Si ocurre un error durante el proceso, captura el error y lo lanza.
	 */
	static async readInformes(userId, searchValues, conn = dbConn) {
		try {
			const page = searchValues.page;
			const fechaInicio = searchValues.fechaInicio;
			const fechaFin = searchValues.fechaFin;
			const limit = searchValues.limit;

			const {
				rows: resultados,
				actualPage: pagina_actual,
				total: cantidad_informes,
				totalPages: paginas_totales,
			} = await InformeModel.fetchAll(userId, searchValues, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página de citas solicitada no existe.');
			}

			let query = '';

			if (fechaInicio) {
				query += `&fechaInicio=${fechaInicio}`;
			}

			if (fechaFin) {
				query += `&fechaFin=${fechaFin}`;
			}

			const prev =
				pagina_actual > 1
					? `/informe/listado-informe?page=${page - 1}&limit=${limit}${query}`
					: null;
			const next =
				pagina_actual < paginas_totales
					? `/informe/listado-informe?page=${page + 1}&limit=${limit}${query}`
					: null;
			const result_min = (page - 1) * limit + 1;
			const result_max = page * limit;
			const fecha_inicio = tz(fechaInicio, 'Europe/Madrid').format('DD-MM-YYYY');
			const fecha_fin = tz(fechaFin, 'Europe/Madrid').format('DD-MM-YYYY');
			const items_pagina = parseInt(limit);

			return {
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_informes,
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
	 * @method readInforme
	 * @description Método para leer un informe por su ID.
	 * @static
	 * @async
	 * @memberof InformeService
	 * @param {number} id - El ID del informe.
	 * @param {number} userId - El ID del usuario que realiza la solicitud.
	 * @param {number} userRole - El rol del usuario que realiza la solicitud.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa el informe.
	 */
	static async readInforme(id, userId, userRole, conn = dbConn) {
		try {
			const paciente = await CitaService.readPacienteIdByInformeId(id, conn);
			userId=parseInt(userId);

			if (!paciente) {
				throw new Error('Informe no encontrado.');
			}

			if (userRole === 2 && paciente.paciente_id !== userId) {
				throw new Error('No tienes permiso para realizar esta acción.');
			}
			const informe = await InformeModel.fetchById(id, conn);

			if (!informe) {
				throw new Error('Informe no encontrado.');
			}

			return informe;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method printInformePDF
	 * @description Método para imprimir un informe en formato PDF.
	 * @static
	 * @async
	 * @memberof InformeService
	 * @param {number} informeId - El ID del informe.
	 * @param {number} userId - El ID del usuario que realiza la solicitud.
	 * @param {number} userRole - El rol del usuario que realiza la solicitud.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<string>} La ruta del archivo PDF generado.
	 * @throws {Error} Si ocurre un error durante el proceso, captura el error y lo lanza.
	 */
	static async printInformePDF(informeId, userId, userRole, conn = dbConn) {
		try {
			const informe = await InformeService.readInforme(informeId, userId, userRole, conn);
			return await PdfService.generateInforme(informe);
		} catch (err) {
			throw err;
		}

	}

	/**
	 * @method createInforme
	 * @description Método para crear un informe.
	 * @static
	 * @async
	 * @memberof InformeService
	 * @param {Object} data - Los datos del informe.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<Object>} Un objeto que representa el informe creado.
	 * @throws {Error} Si la patología no existe, se lanza un error.
	 */
	static async createInforme(data, conn = null) {
		const isConnProvided = !!conn;

		const informe = ObjectFactory.createInformeObject(data);

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const informeCreado = await InformeModel.create(informe, conn);
			const informeId = informeCreado.insertId;

			for (const patologiaId of informe.patologias) {
				const patologiaExists = await PatologiaService.readPatologiaById(patologiaId, conn);

				if (!patologiaExists) {
					throw new Error('La patología no existe.');
				}

				await InformePatologiaService.addInformePatologia(informeId, patologiaId, conn);
			}

			await CitaService.updateInformeId(informe.cita_id, informeId, conn);

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}

			throw new Error(err);
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method deleteInforme
	 * @description Método para eliminar un informe.
	 * @static
	 * @async
	 * @memberof InformeService
	 * @param {number} id - El ID del informe.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deleteInforme(id, conn = dbConn) {
		return await InformeModel.deleteInforme(id, conn);
	}
}

// Exportación del servicio
export default InformeService;
