const router = require('express').Router();
const ContactoController = require('../../controllers/contacto.controller');

const { validateContacto } = require("../../helpers/validators/contacto.validator");

// Rutas POST
router.post('/contacto',
    validateContacto,
    ContactoController.postContacto);

module.exports = router;