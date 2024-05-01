// Importación de los servicios necesarios
const EmailService = require('../services/email.service');

/**
 * @name postContacto
 * @description Método asíncrono que envía un correo electrónico de contacto.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
 *              Si ocurre algún error durante el envío del correo electrónico, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Contacto
 */
exports.postContacto = async (req, res) => {
  let mensaje = req.body.mensaje;
  mensaje = mensaje.replace(/(\r\n|\n|\r)/g, '<br>');

  const contacto = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    email: req.body.email,
    telefono: req.body.telefono,
    mensaje: mensaje
  }

  try {
    await EmailService.sendContactEmail(contacto);
    return res.status(200).json({message: 'Mensaje enviado exitosamente.'});
  } catch (err) {
    return res.status(500).json({
      errors: ['Error al enviar el mensaje.']
    });
  }
}