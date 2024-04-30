const router = require('express').Router();
const PacienteController = require('../../controllers/paciente.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');

router.get('/paciente',
  tokenVerify,
  tokenRole([3]),
  PacienteController.getPacientes);

module.exports = router;