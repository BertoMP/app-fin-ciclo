const router = require('express').Router();
const CitaController = require('../../controllers/cita.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenUserId = require('../../helpers/jwt/tokenUserId');

const { validateCita } = require("../../helpers/validators/cita.validator");
const { validateCitaIdParam } = require("../../helpers/validators/params/citaIdParam.validator");
const { validatePaginationQueryParams } = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const { validateDateQueryParams } = require("../../helpers/validators/queryParams/dateQueryParams.validator");

// Rutas GET
router.get('/cita/agenda',
    tokenVerify,
    tokenRole([3]),
    tokenUserId,
    CitaController.getCitasAgenda);

router.get('/cita',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    validatePaginationQueryParams,
    validateDateQueryParams,
    CitaController.getCitas);

// Rutas POST
router.post('/cita',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    validateCita,
    CitaController.createCita);

// Rutas DELETE
router.delete('/cita/:cita_id',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    validateCitaIdParam,
    CitaController.deleteCita);

module.exports = router;