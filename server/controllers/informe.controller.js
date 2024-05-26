// Importación de los servicios necesarios
import InformeService from '../services/informe.service.js';
import PdfService from '../services/pdf.service.js';

// Importación de las librerías necesarias
import {getSearchValues} from "../util/functions/getSearchValues.js";

/**
 * @class InformeController
 * @description Clase estática que implementa la lógica de los informes de la aplicación.
 */
class InformeController {
	/**
	 * @name getInformes
	 * @description Método asíncrono que obtiene todos los informes de la base de datos.
	 * 						Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los informes.
	 * 						Si ocurre algún error durante el proceso, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param req - El objeto de solicitud de Express.
	 * @param res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof InformeController
	 */
	static async getInformes(req, res) {
		let user_id = 0;

		if (req.user_role === 2) {
			user_id = req.user_id;
		} else if (req.user_role === 3) {
			user_id = req.params.usuario_id;
		}

		try {
			const searchParams = getSearchValues(req, 'date');
			const informes = await InformeService.readInformes(user_id, searchParams);

			return res.status(200).json({
				prev: informes.prev,
				next: informes.next,
				pagina_actual: informes.pagina_actual,
				paginas_totales: informes.paginas_totales,
				cantidad_informes: informes.cantidad_informes,
				result_min: informes.result_min,
				result_max: informes.result_max,
				items_pagina: informes.items_pagina,
				fecha_inicio: informes.fecha_inicio,
				fecha_fin: informes.fecha_fin,
				resultados: informes.resultados,
			});
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name getInforme
	 * @description Método asíncrono que obtiene un informe específico de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del informe.
	 *              Si el informe no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof InformeController
	 */
	static async getInforme(req, res) {
		const user_id = req.user_id;
		const user_role = req.user_role;
		const informe_id = parseInt(req.params.informe_id);

		try {
			const informe = await InformeService.readInforme(informe_id, user_id, user_role);

			return res.status(200).json(informe);
		} catch (err) {
			if (err.message === 'Informe no encontrado.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

			if (err.message === 'No tienes permiso para realizar esta acción.') {
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
	 * @name generaInformePDF
	 * @description Método asíncrono que genera un informe en formato PDF.
	 *              Devuelve el archivo PDF para su descarga.
	 *              Si el informe no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof InformeController
	 */
	static async generaInformePDF(req, res) {
		const user_role = req.user_role;
		const informe_id = parseInt(req.params.informe_id);

		let file;

		try {
			file = await InformeService.printInformePDF(informe_id, req.user_id, user_role);

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

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name createInforme
	 * @description Método asíncrono que crea un nuevo informe en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si ocurre algún error durante la creación del informe, devuelve un error con el mensaje correspondiente.
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof InformeController
	 */
	static async createInforme(req, res) {
		try {
			await InformeService.createInforme(req.body);

			return res.status(200).json({
				message: 'Informe creado correctamente.',
			});
		} catch (err) {
			if (err.message === 'La patología no existe.') {
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

// Exportación del módulo
export default InformeController;
