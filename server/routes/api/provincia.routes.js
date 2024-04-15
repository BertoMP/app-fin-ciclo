const router = require('express').Router();
const provinciaController = require('../../controllers/provincia.controller');

// Ruta GET
router.get('/provincia', provinciaController.getProvincias);

module.exports = router;