const router = require('express').Router();
const UsuarioController = require('../../controllers/usuario.controller');
const multer = require('../../util/functions/multer');

const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');

const { validateUserRegister } = require("../../util/validators/usuarioRegistro.validator");
const { validateUserLogin } = require("../../util/validators/usuarioLogin.validator");
const { validatePacienteRegister } = require("../../util/validators/pacienteRegistro.validador");
const { validateEspecialistaRegister } = require("../../util/validators/especialistaRegistro.validator");
const { validateUserPasswordChange } = require("../../util/validators/usuarioPasswordChange.validator");
const {cleanupFiles} = require("../../util/middleware/cleanupFiles");

// Rutas POST
router.post('/usuario/registro',
    multer.none(),
    validatePacienteRegister,
    UsuarioController.postRegistro
);

router.post('/usuario/registro-especialista',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateEspecialistaRegister,
    cleanupFiles,
    UsuarioController.postRegistroEspecialista
);

router.post('/usuario/login',
    multer.none(),
    validateUserLogin,
    UsuarioController.postLogin
);

router.post('/usuario/contrasena-olvidada',
    UsuarioController.postForgotPassword
);

router.post('/usuario/contrasena-reset',
    UsuarioController.postResetPassword
);

// Rutas PUT
router.put('/usuario/password',
    validateUserPasswordChange,
    UsuarioController.postUpdatePassword
);

module.exports = router;