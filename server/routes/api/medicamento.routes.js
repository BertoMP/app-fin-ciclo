const router = require('express').Router();
const MedicamentoController =
    require('../../controllers/medicamento.controller');
const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');

const { validateMedicamento } = require('../../helpers/validators/medicamento.validator');
const { validatePaginationQueryParams } = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const { validateMedicamentoIdParam } = require("../../helpers/validators/params/medicamentoIdParam.validator");

// Rutas GET
router.get('/medicamento/prescripcion',
    tokenVerify,
    tokenRole([3]),
    MedicamentoController.getMedicamentosPrescripcion
);

router.get('/medicamento/:medicamento_id',
    tokenVerify,
    tokenRole([3]),
    validateMedicamentoIdParam,
    MedicamentoController.getMedicamentoById);

router.get('/medicamento',
    tokenVerify,
    tokenRole([3]),
    validatePaginationQueryParams,
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


module.exports = router;