const router = require('express').Router();
const InformeController = require('../../controllers/informe.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenUserId');

const { validateInforme } = require("../../helpers/validators/informe.validator");
const { validateInformeIdParam } = require("../../helpers/validators/params/informeIdParam.validator");

// Rutas GET
router.get('/informe/genera-pdf/:informe_id',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateInformeIdParam,
    InformeController.generaInformePDF);

router.get('/informe/:informe_id',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateInformeIdParam,
    InformeController.getInforme);

// Rutas POST
router.post('/informe',
    tokenVerify,
    tokenRole([3]),
    validateInforme,
    InformeController.createInforme);

module.exports = router;