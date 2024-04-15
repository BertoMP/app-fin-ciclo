const router = require('express').Router();
const tipoViaController = require('../../controllers/tipoVia.controller');

// Ruta GET
router.get('/tipo-via', tipoViaController.getTipoVia);

module.exports = router;