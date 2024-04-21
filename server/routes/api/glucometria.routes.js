const router = require('express').Router();
const glucometriaController = require('../../controllers/glucometria.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenUserId = require('../../helpers/jwt/tokenUserId');

const { validateGlucometria } = require('../../helpers/validators/glucometria.validator');
const { validatePaginationQueryParams } = require("../../helpers/validators/params/paginationQueryParams.validator");
const { validatePacienteIdParam } = require("../../helpers/validators/params/pacienteIdParam.validator");

// Rutas GET
router.get('/glucometria/:paciente_id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteIdParam,
    validatePaginationQueryParams,
    glucometriaController.getGlucometria);

router.get('/glucometria',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    validatePacienteIdParam,
    validatePaginationQueryParams,
    glucometriaController.getGlucometria);

// Rutas POST
router.post('/glucometria',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    validateGlucometria,
    glucometriaController.postGlucometria);

module.exports = router;