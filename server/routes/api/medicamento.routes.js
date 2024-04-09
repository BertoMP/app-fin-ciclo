const router = require('express').Router();
const MedicamentoController =
    require('../../controllers/medicamento.controller');
const tokenVerify = require('../../middlewares/tokenVerify');
const tokenRole = require('../../middlewares/tokenRole');

// Rutas GET
router.get('/medicamento',
    tokenVerify,
    tokenRole([3]),
    MedicamentoController.getMedicamentos
);
router.get('/medicamento/:id',
    tokenVerify,
    tokenRole([3]),
    MedicamentoController.getMedicamentoById);

// Rutas POST
router.post('/medicamento',
    tokenVerify,
    tokenRole([3]),
    MedicamentoController.validateMedicamento,
    MedicamentoController.createMedicamento);

// Rutas PUT
router.put('/medicamento/:id',
    tokenVerify,
    tokenRole([3]),
    MedicamentoController.validateMedicamento,
    MedicamentoController.updateMedicamento);

// Rutas DELETE
router.delete('/medicamento/:id',
    tokenVerify,
    tokenRole([3]),
    MedicamentoController.deleteMedicamento);


module.exports = router;