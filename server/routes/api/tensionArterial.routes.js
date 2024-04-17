const router = require('express').Router();
const tensionArterialController = require('../../controllers/tensionArterial.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenId');

const { validateTensionArterial } = require('../../helpers/validators/tensionArterial.validator');
const { validateQueryParams } = require('../../helpers/validators/queryParams.validator');
const {validateParams} = require("../../helpers/validators/params.validator");

// Rutas GET
router.get('/tension-arterial/:id',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateParams,
    validateQueryParams,
    tensionArterialController.getTensionArterial);

// Rutas POST
router.post('/tension-arterial',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    validateTensionArterial,
    tensionArterialController.postTensionArterial);

module.exports = router;