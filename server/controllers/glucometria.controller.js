// Importación de los servicios necesarios
import GlucometriaService from '../services/glucometria.service.js';
import PacienteService from '../services/paciente.service.js';

// Importación de funciones
import { getSearchValues } from "../util/functions/getSearchValues.js";
import ObjectFactory from "../util/classes/objectFactory.js";

/**
 * @class GlucometriaController
 * @description Clase estática que implementa la lógica de las glucometrías de la aplicación.
 */
class GlucometriaController {
	/**
	 * @name getGlucometria
	 * @description Método asíncrono que obtiene glucometrías de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
	 *              la página actual, el total de páginas, el total de glucometrías, el rango de resultados,
	 *              la fecha de inicio, la fecha de fin, los elementos por página y las glucometrías.
	 *              Si la página solicitada no existe o el paciente no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof GlucometriaController
	 */
	static async getGlucometria(req, res) {
		let paciente_id = 0;

		if (req.user_role === 2) {
			paciente_id = req.user_id;
		} else if (req.user_role === 3) {
			paciente_id = req.params.usuario_id;
		}

		paciente_id = parseInt(paciente_id);

		try {
			const searchValues = getSearchValues(req, 'date');

			const glucometrias = await GlucometriaService.readGlucometria(searchValues, paciente_id);

			return res.status(200).json({
				prev: glucometrias.prev,
				next: glucometrias.next,
				pagina_actual: glucometrias.pagina_actual,
				paginas_totales: glucometrias.paginas_totales,
				cantidad_glucometrias: glucometrias.cantidad_glucometrias,
				rango: glucometrias.rango,
				fechaInicio: searchValues.fechaInicio,
				fechaFin: searchValues.fechaFin,
				limit: searchValues.limit,
				glucometrias: glucometrias.resultados,
			});

		} catch (err) {
			if (err.message === 'El paciente no existe.') {
				return res.status(404).json({
					errors: [err.message],
				});
			}

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
	 * @name postGlucometria
	 * @description Método asíncrono que crea una nueva glucometría en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si ocurre algún error durante la creación de la glucometría, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof GlucometriaController
	 */
	static async postGlucometria(req, res) {
		const paciente_id = req.user_id;

		try {
			await GlucometriaService.createGlucometria(paciente_id, req.body);

			return res.status(200).json({ message: 'Glucometría creada exitosamente.' });
		} catch (err) {
			return res.status(500).json({
				errors: ['Error al crear la glucometría.'],
			});
		}
	}
}

// Exportación del controlador
export default GlucometriaController;
