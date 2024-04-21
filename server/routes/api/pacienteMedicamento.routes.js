const router = require('express').Router();
const pacienteMedicamentoController = require('../../controllers/pacienteMedicamento.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenUserId = require('../../helpers/jwt/tokenUserId');

const { validatePacienteMedicamento } = require('../../helpers/validators/pacienteMedicamento.validator');
const { validateUsuarioIdParam } = require("../../helpers/validators/params/usuarioIdParam.validator");
const { validateMedicamentoIdParam } = require("../../helpers/validators/params/medicamentoIdParam.validator");

// Rutas GET
router.get('/paciente-medicamento/pdf/:usuario_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    pacienteMedicamentoController.getPacienteMedicamentoPDF);

router.get('/paciente-medicamento/pdf',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    pacienteMedicamentoController.getPacienteMedicamentoPDF);

router.get('/paciente-medicamento/:usuario_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    pacienteMedicamentoController.getPacienteMedicamento);

router.get('/paciente-medicamento',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    pacienteMedicamentoController.getPacienteMedicamento);

// Rutas POST
router.post('/paciente-medicamento/:usuario_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    validatePacienteMedicamento,
    pacienteMedicamentoController.postPacienteMedicamento);

// Rutas PUT
router.put('/paciente-medicamento/:usuario_id/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    validateMedicamentoIdParam,
    validatePacienteMedicamento,
    pacienteMedicamentoController.putPacienteMedicamento);

// Rutas DELETE
router.delete('/paciente-medicamento/:usuario_id/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validateUsuarioIdParam,
    validateMedicamentoIdParam,
    pacienteMedicamentoController.deletePacienteMedicamento);

module.exports = router;