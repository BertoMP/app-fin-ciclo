const router = require('express').Router();
const MedicamentoController =
    require('../../controllers/medicamento.controller');
const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');

const { validateMedicamento } = require('../../helpers/validators/medicamento.validator');
const { validatePaginationQueryParams } = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const { validateDateQueryParams } = require("../../helpers/validators/queryParams/dateQueryParams.validator");
const { validateMedicamentoIdParam } = require("../../helpers/validators/params/medicamentoIdParam.validator");

// Rutas GET
router.get('/medicamento/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validateMedicamentoIdParam,
    MedicamentoController.getMedicamentoById);

router.get('/medicamento',
    tokenVerify,
    tokenRole([3]),
    validatePaginationQueryParams,
    validateDateQueryParams,
    MedicamentoController.getMedicamentos
);

// Rutas POST
router.post('/medicamento',
    tokenVerify,
    tokenRole([3]),
    validateMedicamento,
    MedicamentoController.createMedicamento);

// Rutas PUT
router.put('/medicamento/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validateMedicamentoIdParam,
    validateMedicamento,
    MedicamentoController.updateMedicamento);

// Rutas DELETE
router.delete('/medicamento/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validateMedicamentoIdParam,
    MedicamentoController.deleteMedicamento);


module.exports = router;