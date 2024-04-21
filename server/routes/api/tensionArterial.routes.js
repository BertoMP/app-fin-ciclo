const router = require('express').Router();
const tensionArterialController = require('../../controllers/tensionArterial.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenUserId');

const { validateTensionArterial } = require('../../helpers/validators/tensionArterial.validator');
const { validatePaginationQueryParams } = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const { validateDateQueryParams} = require('../../helpers/validators/queryParams/dateQueryParams.validator');
const { validateUsuarioIdParam } = require('../../helpers/validators/params/usuarioIdParam.validator');

// Rutas GET
router.get('/tension-arterial/:usuario_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    validatePaginationQueryParams,
    validateDateQueryParams,
    tensionArterialController.getTensionArterial);

router.get('/tension-arterial',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    validatePaginationQueryParams,
    validateDateQueryParams,
    tensionArterialController.getTensionArterial);

// Rutas POST
router.post('/tension-arterial',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    validateTensionArterial,
    tensionArterialController.postTensionArterial);

module.exports = router;