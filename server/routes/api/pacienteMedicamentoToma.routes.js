const router = require('express').Router();
const pacienteTomaMedicamentoController = require('../../controllers/pacienteTomaMedicamento.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenUserId = require('../../helpers/jwt/tokenUserId');

const { validatePacienteMedicamentoToma } = require('../../helpers/validators/pacienteMedicamentoToma.validator');
const { validateUsuarioIdParam } = require("../../helpers/validators/params/usuarioIdParam.validator");

// Rutas GET
router.get('/prescripcion',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    pacienteTomaMedicamentoController.getRecetas);

router.get('/prescripcion/:usuario_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    pacienteTomaMedicamentoController.getRecetas);

// router.get('/receta/pdf',
//     tokenVerify,
//     tokenRole([2]),
//     tokenUserId,
//     pacienteMedicamentoTomaController.getRecetaPDF);
//
// router.get('/receta/pdf/:usuario_id',
//     tokenVerify,
//     tokenRole([3]),
//     validateUsuarioIdParam,
//     pacienteMedicamentoTomaController.getRecetaPDF);

// Rutas POST
router.post('/prescripcion',
    tokenVerify,
    tokenRole([3]),
    validatePacienteMedicamentoToma,
    pacienteTomaMedicamentoController.postReceta);

module.exports = router;