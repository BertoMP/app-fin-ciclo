const router = require('express').Router();
const medicamentoController = require('../../controllers/medicamento.controller');

// Rutas GET
router.get('/', medicamentoController.getMedicamentos);
router.get('/:id', medicamentoController.getMedicamentoById);

// Rutas POST
router.post('/',
    medicamentoController.validateMedicamento,
    medicamentoController.postMedicamento);
router.post('/delete/:id', medicamentoController.deleteMedicamento);
router.post('/update/:id',
    medicamentoController.validateMedicamento,
    medicamentoController.updateMedicamento);

module.exports = router;