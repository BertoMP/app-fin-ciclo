const router = require('express').Router();
const pacienteMedicamentoController = require('../../controllers/pacienteMedicamento.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenId');

const { validatePacienteMedicamento } = require('../../helpers/validators/pacienteMedicamento.validator');
const { validateParams } = require("../../helpers/validators/params.validator");

// Rutas GET
router.get('/paciente-medicamento/:id',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateParams,
    pacienteMedicamentoController.getPacienteMedicamento);

router.get('/paciente-medicamento/:id/pdf',
    tokenVerify,
    tokenRole([2, 3]),
    tokenId,
    validateParams,
    pacienteMedicamentoController.getPacienteMedicamentoPDF);

// Rutas POST
router.post('/paciente-medicamento/:id',
    tokenVerify,
    tokenRole([3]),
    validatePacienteMedicamento,
    pacienteMedicamentoController.postPacienteMedicamento);

// Rutas PUT
router.put('/paciente-medicamento/:id/:idMedicamento',
    tokenVerify,
    tokenRole([3]),
    validateParams,
    validatePacienteMedicamento,
    pacienteMedicamentoController.putPacienteMedicamento);

// Rutas DELETE
router.delete('/paciente-medicamento/:id/:idMedicamento',
    tokenVerify,
    tokenRole([3]),
    validateParams,
    pacienteMedicamentoController.deletePacienteMedicamento);

module.exports = router;