const emailService = require('../services/email.service');

exports.postContacto = async (req, res) => {
    const contacto = {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.telefono,
        mensaje: req.body.mensaje
    }

    try {
        await emailService.sendContactEmail(contacto);
        res.status(200).json({ message: 'Mensaje enviado exitosamente.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}