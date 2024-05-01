// Importación de los servicios necesarios
const EmailService = require('../services/email.service');

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