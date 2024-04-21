const router = require('express').Router();
const ConsultaController = require('../../controllers/consulta.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');

const { validateConsulta } = require("../../helpers/validators/consulta.validator");
const { validateConsultaIdParam } = require("../../helpers/validators/params/consultaIdParam.validator");

// Rutas GET
router.get('/consulta/:consulta_id',
    tokenVerify,
    tokenRole([1]),
    validateConsultaIdParam,
    ConsultaController.getConsultaById);

router.get('/consulta',
    tokenVerify,
    tokenRole([1]),
    ConsultaController.getConsultas);

// Rutas POST
router.post('/consulta',
    tokenVerify,
    tokenRole([1]),
    validateConsulta,
    ConsultaController.createConsulta);

// Rutas PUT
router.put('/consulta/:consulta_id',
    tokenVerify,
    tokenRole([1]),
    validateConsultaIdParam,
    validateConsulta,
    ConsultaController.updateConsulta);

// Rutas DELETE
router.delete('/consulta/:consulta_id',
    tokenVerify,
    tokenRole([1]),
    validateConsultaIdParam,
    ConsultaController.deleteConsulta);

module.exports = router;