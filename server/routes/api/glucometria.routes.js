const router = require('express').Router();
const glucometriaController = require('../../controllers/glucometria.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenUserId = require('../../helpers/jwt/tokenUserId');

const { validateGlucometria } = require('../../helpers/validators/glucometria.validator');
const { validatePaginationQueryParams } = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const { validateDateQueryParams } = require("../../helpers/validators/queryParams/dateQueryParams.validator");
const { validateUsuarioIdParam } = require("../../helpers/validators/params/usuarioIdParam.validator");

// Rutas GET
router.get('/glucometria/:usuario_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    validatePaginationQueryParams,
    validateDateQueryParams,
    glucometriaController.getGlucometria);

router.get('/glucometria',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    validatePaginationQueryParams,
    validateDateQueryParams,
    glucometriaController.getGlucometria);

// Rutas POST
router.post('/glucometria',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    validateGlucometria,
    glucometriaController.postGlucometria);

module.exports = router;