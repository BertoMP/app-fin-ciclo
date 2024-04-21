const router = require('express').Router();
const tensionArterialController = require('../../controllers/tensionArterial.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenUserId');

const { validateTensionArterial } = require('../../helpers/validators/tensionArterial.validator');
const { validatePaginationQueryParams } = require('../../helpers/validators/params/paginationQueryParams.validator');
const { validatePacienteIdParam } = require('../../helpers/validators/params/pacienteIdParam.validator');

// Rutas GET
router.get('/tension-arterial/:paciente_id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteIdParam,
    validatePaginationQueryParams,
    tensionArterialController.getTensionArterial);

router.get('/tension-arterial',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    validatePaginationQueryParams,
    tensionArterialController.getTensionArterial);

// Rutas POST
router.post('/tension-arterial',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    validateTensionArterial,
    tensionArterialController.postTensionArterial);

module.exports = router;