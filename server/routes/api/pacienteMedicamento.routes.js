const router = require('express').Router();
const pacienteMedicamentoController = require('../../controllers/pacienteMedicamento.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenUserId = require('../../helpers/jwt/tokenUserId');

const { validatePacienteMedicamento } = require('../../helpers/validators/pacienteMedicamento.validator');
const { validatePacienteIdParam } = require("../../helpers/validators/params/pacienteIdParam.validator");
const { validateMedicamentoIdParam } = require("../../helpers/validators/params/medicamentoIdParam.validator");

// Rutas GET
router.get('/paciente-medicamento/pdf/:paciente_id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteIdParam,
    pacienteMedicamentoController.getPacienteMedicamentoPDF);

router.get('/paciente-medicamento/pdf',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    pacienteMedicamentoController.getPacienteMedicamentoPDF);

router.get('/paciente-medicamento/:paciente_id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteIdParam,
    pacienteMedicamentoController.getPacienteMedicamento);

router.get('/paciente-medicamento',
    tokenVerify,
    tokenRole([2]),
    tokenUserId,
    pacienteMedicamentoController.getPacienteMedicamento);

// Rutas POST
router.post('/paciente-medicamento/:paciente_id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteIdParam,
    validatePacienteMedicamento,
    pacienteMedicamentoController.postPacienteMedicamento);

// Rutas PUT
router.put('/paciente-medicamento/:paciente_id/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteIdParam,
    validateMedicamentoIdParam,
    validatePacienteMedicamento,
    pacienteMedicamentoController.putPacienteMedicamento);

// Rutas DELETE
router.delete('/paciente-medicamento/:paciente_id/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteIdParam,
    validateMedicamentoIdParam,
    pacienteMedicamentoController.deletePacienteMedicamento);

module.exports = router;