// Importación de los servicios necesarios
import EmailService from '../services/email.service.js';
import ObjectFactory from "../util/classes/objectFactory.js";

/**
 * @class ContactoController
 * @description Clase estática que implementa la lógica de los correos electrónicos de contacto de la aplicación.
 */
class ContactoController {
	/**
	 * @name postContacto
	 * @description Método asíncrono que envía un correo electrónico de contacto.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si ocurre algún error durante el envío del correo electrónico, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof ContactoController
	 */
	static async postContacto(req, res) {
		const contacto = ObjectFactory.createConstactoObject(req.body);

		try {
			await EmailService.sendContactEmail(contacto);

			return res.status(200).json({ message: 'Mensaje enviado exitosamente.' });
		} catch (err) {
			return res.status(500).json({
				errors: ['Error al enviar el mensaje.'],
			});
		}
	}
}

// Exportación del controlador
export default ContactoController;
