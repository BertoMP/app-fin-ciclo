const router = require('express').Router();
const MedicamentoController =
    require('../../controllers/medicamento.controller');
const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');

const { validateMedicamento } = require('../../util/validators/medicamento.validator');
const { validateQueryParams } = require("../../util/validators/queryParams.validator");
const {validateParams} = require("../../util/validators/params.validator");

// Rutas GET
router.get('/medicamento',
    tokenVerify,
    tokenRole([3]),
    validateQueryParams,
    MedicamentoController.getMedicamentos
);
router.get('/medicamento/:id',
    tokenVerify,
    tokenRole([3]),
    validateParams,
    MedicamentoController.getMedicamentoById);

// Rutas POST
router.post('/medicamento',
    tokenVerify,
    tokenRole([3]),
    validateMedicamento,
    MedicamentoController.createMedicamento);

// Rutas PUT
router.put('/medicamento/:id',
    tokenVerify,
    tokenRole([3]),
    validateParams,
    validateMedicamento,
    MedicamentoController.updateMedicamento);

// Rutas DELETE
router.delete('/medicamento/:id',
    tokenVerify,
    tokenRole([3]),
    validateParams,
    MedicamentoController.deleteMedicamento);


module.exports = router;