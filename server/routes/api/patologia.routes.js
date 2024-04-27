const router = require('express').Router();
const PatologiaController = require('../../controllers/patologia.controller');

const tokenVerify = require("../../helpers/jwt/tokenVerify");
const tokenRole = require("../../helpers/jwt/tokenRole");

const {validatePaginationQueryParams} = require("../../helpers/validators/queryParams/paginationQueryParams.validator");



// Ruta GET
router.get('/patologia/informe',
    tokenVerify,
    tokenRole([3]),
    PatologiaController.getPatologiasInforme);

router.get('/patologia/:patologia_id',
    tokenVerify,
    tokenRole([3]),
    PatologiaController.getPatologiaById);

router.get('/patologia',
    tokenVerify,
    tokenRole([3]),
    validatePaginationQueryParams,
    PatologiaController.getPatologias);

// Ruta POST
router.post('/patologia',
    tokenVerify,
    tokenRole([3]),
    PatologiaController.createPatologia);

// Ruta PUT
router.put('/patologia/:patologia_id',
    tokenVerify,
    tokenRole([3]),
    PatologiaController.updatePatologia);

// Ruta DELETE
router.delete('/patologia/:patologia_id',
    tokenVerify,
    tokenRole([3]),
    PatologiaController.deletePatologia);

module.exports = router;