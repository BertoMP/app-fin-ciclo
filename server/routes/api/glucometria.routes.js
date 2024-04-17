const router = require('express').Router();
const glucometriaController = require('../../controllers/glucometria.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenId');

const { validateGlucometria } = require('../../helpers/validators/glucometria.validator');
const { validateQueryParams } = require("../../helpers/validators/queryParams.validator");
const {validateParams} = require("../../helpers/validators/params.validator");

// Rutas GET
router.get('/glucometria/:id',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateParams,
    validateQueryParams,
    glucometriaController.getGlucometria);

// Rutas POST
router.post('/glucometria',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    validateGlucometria,
    glucometriaController.postGlucometria);

module.exports = router;