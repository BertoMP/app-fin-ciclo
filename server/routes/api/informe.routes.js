const router = require('express').Router();
const InformeController = require('../../controllers/informe.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenId');

const { validateInforme } = require("../../helpers/validators/informe.validator");
const { validateParams } = require("../../helpers/validators/params.validator");

// Rutas GET
router.get('/informe/:id',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateParams,
    InformeController.getInforme);

router.get('/informe/genera-pdf/:id',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateParams,
    InformeController.generaInformePDF);

// Rutas POST
router.post('/informe',
    tokenVerify,
    tokenRole([2]),
    validateInforme,
    InformeController.createInforme);

module.exports = router;