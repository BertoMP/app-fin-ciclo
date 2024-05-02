// Importación de los servicios necesarios
import ProvinciaService from '../services/provincia.service.js';

/**
 * @class ProvinciaController
 * @description Clase estática que implementa la lógica de las provincias de la aplicación.
 */
class ProvinciaController {
	/**
	 * @name getProvincias
	 * @description Método asíncrono que obtiene todas las provincias de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de las provincias.
	 *              Si no se encuentran provincias, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof ProvinciaController
	 */
	static async getProvincias(req, res) {
		try {
			const provincias = await ProvinciaService.readProvincias();

			if (!provincias) {
				return res.status(404).json({
					errors: ['Las provincias no fueron encontradas.'],
				});
			}

			return res.status(200).json(provincias);
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación del controlador
export default ProvinciaController;
