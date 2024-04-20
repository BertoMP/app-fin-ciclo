const router = require('express').Router();
const CitaController = require('../../controllers/cita.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenId');

const { validateCita } = require("../../helpers/validators/cita.validator");
const { validateParams } = require("../../helpers/validators/params.validator");
const { validateQueryParams } = require("../../helpers/validators/queryParams.validator");

// Rutas GET
router.get('/cita/:id',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    validateParams,
    validateQueryParams,
    CitaController.getCitas);

router.get('/cita-agenda/:id',
    tokenVerify,
    tokenRole([3]),
    validateParams,
    validateQueryParams,
    CitaController.getCitasAgenda);

// Rutas POST
router.post('/cita',
    tokenVerify,
    tokenRole([2]),
    validateCita,
    CitaController.createCita);

// Rutas DELETE
router.delete('/cita/:id',
    tokenVerify,
    tokenRole([2]),
    validateParams,
    CitaController.deleteCita);

module.exports = router;