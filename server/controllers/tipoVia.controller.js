// Importación de los servicios necesarios
import TipoViaService from '../services/tipoVia.service.js';

/**
 * @class TipoViaController
 * @description Clase estática que implementa la lógica de los tipos de vía de la aplicación.
 */
class TipoViaController {
	/**
	 * @name getTipoVia
	 * @description Método asíncrono que obtiene todos los tipos de vía de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los tipos de vía.
	 *              Si no se encuentran tipos de vía, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Promise<Object>} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof TipoViaController
	 */
	static async getTipoVia(req, res) {
		try {
			const tipoVia = await TipoViaService.readTipoVia();

			return res.status(200).json(tipoVia);
		} catch (err) {
			if (err.message === 'Los tipos de vía no fueron encontrados.') {
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
export default TipoViaController;
