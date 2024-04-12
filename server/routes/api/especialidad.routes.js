const router = require('express').Router();
const EspecialidadController =
    require('../../controllers/especialidad.controller');
const multer = require('../../util/functions/multer');
const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');
const {validateEspecialidad} = require("../../util/validators/especialidad.validator");

// Rutas GET
router.get('/especialidad', EspecialidadController.getEspecialidades);
router.get('/especialidad/:id', EspecialidadController.getEspecialidadById);

// Rutas POST
router.post('/especialidad',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateEspecialidad,
    EspecialidadController.createEspecialidad);

// Rutas PUT
router.put('/especialidad/:id',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateEspecialidad,
    EspecialidadController.updateEspecialidad);

// Rutas DELETE
router.delete('/especialidad/:id',
    tokenVerify,
    tokenRole([1]),
    EspecialidadController.deleteEspecialidad);

module.exports = router;