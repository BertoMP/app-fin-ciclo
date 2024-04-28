const router = require('express').Router();
const pacienteTomaMedicamentoController = require('../../controllers/pacienteTomaMedicamento.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenUserId = require('../../helpers/jwt/tokenUserId');

const {validatePacienteMedicamentoToma} = require('../../helpers/validators/pacienteMedicamentoToma.validator');
const {validateUsuarioIdParam} = require("../../helpers/validators/params/usuarioIdParam.validator");
const {validateTomaIdParam} = require("../../helpers/validators/params/tomaIdParam");
const {validateMedicamentoIdParam} = require("../../helpers/validators/params/medicamentoIdParam.validator");

// Rutas GET
router.get('/prescripcion/pdf/:usuario_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  pacienteTomaMedicamentoController.getRecetaPDF);

router.get('/prescripcion/pdf',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  pacienteTomaMedicamentoController.getRecetaPDF);

router.get('/prescripcion/:usuario_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  pacienteTomaMedicamentoController.getRecetas);

router.get('/prescripcion',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  pacienteTomaMedicamentoController.getRecetas);

// Rutas POST
router.post('/prescripcion',
  tokenVerify,
  tokenRole([3]),
  validatePacienteMedicamentoToma,
  pacienteTomaMedicamentoController.postReceta);

// Rutas DELETE
router.delete('/prescripcion/borrar-toma/:toma_id',
  tokenVerify,
  tokenRole([3]),
  validateTomaIdParam,
  pacienteTomaMedicamentoController.deleteToma);

router.delete('/prescripcion/borrar-medicamento/:usuario_id/:medicamento_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  validateMedicamentoIdParam,
  pacienteTomaMedicamentoController.deleteMedicamento);

module.exports = router;