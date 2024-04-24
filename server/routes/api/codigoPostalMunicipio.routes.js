const router = require('express').Router();
const codigoPostalController = require('../../controllers/codigoPostalMunicipio.controller');

// Ruta GET
router.get('/codigo-postal/:municipio_id',
    codigoPostalController.getCodigoPostal);

module.exports = router;