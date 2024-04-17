const router = require('express').Router();
const municipioController = require('../../controllers/municipio.controller');
const {validateParams} = require("../../helpers/validators/params.validator");

// Ruta GET
router.get('/municipio/:id',
    validateParams,
    municipioController.getMunicipio);

module.exports = router;