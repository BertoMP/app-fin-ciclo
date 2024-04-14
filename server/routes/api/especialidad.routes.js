const router = require('express').Router();
const EspecialidadController = require('../../controllers/especialidad.controller');

const multer = require('../../util/functions/multer');

const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');

const { validateEspecialidad } = require("../../util/validators/especialidad.validator");
const { validateParams } = require("../../util/validators/params.validator");

const { cleanupFiles } = require("../../util/middleware/cleanupFiles");

// Rutas GET
router.get('/especialidad',
    EspecialidadController.getEspecialidades);
router.get('/especialidad/:id',
    validateParams,
    EspecialidadController.getEspecialidadById);

// Rutas POST
router.post('/especialidad',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateEspecialidad,
    cleanupFiles,
    EspecialidadController.createEspecialidad);

// Rutas PUT
router.put('/especialidad/:id',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateParams,
    validateEspecialidad,
    EspecialidadController.updateEspecialidad);

// Rutas DELETE
router.delete('/especialidad/:id',
    tokenVerify,
    tokenRole([1]),
    validateParams,
    EspecialidadController.deleteEspecialidad);

module.exports = router;