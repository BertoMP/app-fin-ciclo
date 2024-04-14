const router = require('express').Router();
const tensionArterialController = require('../../controllers/tensionArterial.controller');

const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');
const tokenId = require('../../util/jwt/tokenId');

const { validateTensionArterial } = require('../../util/validators/tensionArterial.validator');
const { validateQueryParams } = require('../../util/validators/queryParams.validator');
const {validateParams} = require("../../util/validators/params.validator");

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