const router = require('express').Router();
const glucometriaController = require('../../controllers/glucometria.controller');

const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');
const tokenId = require('../../util/jwt/tokenId');

const { validateGlucometria } = require('../../util/validators/glucometria.validator');
const { validateQueryParams } = require("../../util/validators/queryParams.validator");
const {validateParams} = require("../../util/validators/params.validator");

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