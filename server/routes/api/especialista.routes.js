const router = require('express').Router();
const EspecialistaController = require('../../controllers/especialista.controller');

const {validateUsuarioIdParam} = require("../../helpers/validators/params/usuarioIdParam.validator");

// Rutas GET
router.get('/especialista/:usuario_id',
    validateUsuarioIdParam,
    EspecialistaController.getEspecialistaById
);

module.exports = router;