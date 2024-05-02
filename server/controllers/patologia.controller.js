// Importación de los servicios necesarios
import PatologiaService from '../services/patologia.service.js';

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
		const page = parseInt(req.query.page) || 1;
		const limit = 10;

		try {
			const {
				rows: resultados,
				actualPage: pagina_actual,
				total: cantidad_patologias,
				totalPages: paginas_totales,
			} = await PatologiaService.readPatologias(page, limit);

			if (page > 1 && page > paginas_totales) {
				return res.status(404).json({
					errors: ['La página de patologías solicitada no existe.'],
				});
			}

			const prev = page > 1 ? `/patologia?page=${page - 1}` : null;
			const next = page < paginas_totales ? `/patologia?page=${page + 1}` : null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;

			return res.status(200).json({
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_patologias,
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

			if (!patologia) {
				return res.status(404).json({
					errors: ['La patología solicitada no existe.'],
				});
			}

			return res.status(200).json(patologia);
		} catch (err) {
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
		let descripcion = req.body.descripcion;
		descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

		const patologia = {
			nombre: req.body.nombre,
			descripcion: descripcion,
		};

		try {
			const patologiaExists = await PatologiaService.readPatologiaByNombre(patologia.nombre);

			if (patologiaExists) {
				return res.status(409).json({
					errors: ['La patología ya existe.'],
				});
			}

			await _createPatologia(patologia);

			return res.status(200).json({
				message: 'Patología creada correctamente.',
			});
		} catch (err) {
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

		let descripcion = req.body.descripcion;
		descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

		const patologia = {
			nombre: req.body.nombre,
			descripcion: descripcion,
		};

		try {
			const currentPatologia = await PatologiaService.readPatologiaById(id);

			if (!currentPatologia) {
				return res.status(404).json({
					errors: ['La patología solicitada no existe.'],
				});
			}

			const patologiaExists = await PatologiaService.readPatologiaByNombre(patologia.nombre);

			if (patologiaExists && patologiaExists.id !== id) {
				return res.status(409).json({
					errors: ['La patología ya existe.'],
				});
			}

			await PatologiaService.updatePatologia(id, patologia);

			return res.status(200).json({
				message: 'Patología actualizada correctamente.',
			});
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación del controlador
export default PatologiaController;
