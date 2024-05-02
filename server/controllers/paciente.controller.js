// Importación de los servicios necesarios
import PacienteService from '../services/paciente.service.js';

/**
 * @class PacienteController
 * @description Clase estática que implementa la lógica de los pacientes de la aplicación.
 */
class PacienteController {
	/**
	 * @name getPacientes
	 * @description Método asíncrono que obtiene todos los pacientes de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los pacientes.
	 *              Si no se encuentran pacientes, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof PacienteController
	 */
	static async getPacientes(req, res) {
		try {
			const pacientes = await PacienteService.readPacientes();

			if (!pacientes) {
				return res.status(404).json({
					errors: ['No se encontraron pacientes'],
				});
			}

			return res.status(200).json({
				pacientes,
			});
		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}
}

// Exportación del controlador
export default PacienteController;
