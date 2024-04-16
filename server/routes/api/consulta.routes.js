const router = require('express').Router();
const ConsultaController = require('../../controllers/consulta.controller');

const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');

const { validateConsulta } = require("../../util/validators/consulta.validator");
const { validateParams } = require("../../util/validators/params.validator");

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