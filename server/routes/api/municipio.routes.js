const router = require('express').Router();
const municipioController = require('../../controllers/municipio.controller');
const { validateProvinciaIdParam } = require('../../helpers/validators/params/provinciaIdParam.validator');

// Ruta GET
router.get('/municipio/:provincia_id',
    validateProvinciaIdParam,
    municipioController.getMunicipio);

module.exports = router;