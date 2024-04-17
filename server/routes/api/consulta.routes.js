const router = require('express').Router();
const ConsultaController = require('../../controllers/consulta.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');

const { validateConsulta } = require("../../helpers/validators/consulta.validator");
const { validateParams } = require("../../helpers/validators/params.validator");

// Rutas GET
router.get('/consulta',
    tokenVerify,
    tokenRole([1]),
    ConsultaController.getConsultas);

router.get('/consulta/:id',
    tokenVerify,
    tokenRole([1]),
    validateParams,
    ConsultaController.getConsultaById);

// Rutas POST
router.post('/consulta',
    tokenVerify,
    tokenRole([1]),
    validateConsulta,
    ConsultaController.createConsulta);

// Rutas PUT
router.put('/consulta/:id',
    tokenVerify,
    tokenRole([1]),
    validateParams,
    validateConsulta,
    ConsultaController.updateConsulta);

// Rutas DELETE
router.delete('/consulta/:id',
    tokenVerify,
    tokenRole([1]),
    validateParams,
    ConsultaController.deleteConsulta);

module.exports = router;