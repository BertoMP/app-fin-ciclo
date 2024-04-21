const router = require('express').Router();
const EspecialidadController = require('../../controllers/especialidad.controller');

const multer = require('../../util/functions/multer');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');

const { validateEspecialidad } = require("../../helpers/validators/especialidad.validator");
const { validateEspecialidadIdParam } = require("../../helpers/validators/params/especialidadIdParam.validator");

const { cleanupFiles } = require("../../util/middleware/cleanupFiles");

// Rutas GET
router.get('/especialidad/:especialidad_id',
    validateEspecialidadIdParam,
    EspecialidadController.getEspecialidadById);

router.get('/especialidad',
    EspecialidadController.getEspecialidades);

// Rutas POST
router.post('/especialidad',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateEspecialidad,
    cleanupFiles,
    EspecialidadController.createEspecialidad);

// Rutas PUT
router.put('/especialidad/:especialidad_id',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateEspecialidadIdParam,
    validateEspecialidad,
    EspecialidadController.updateEspecialidad);

// Rutas DELETE
router.delete('/especialidad/:especialidad_id',
    tokenVerify,
    tokenRole([1]),
    validateEspecialidadIdParam,
    EspecialidadController.deleteEspecialidad);

module.exports = router;