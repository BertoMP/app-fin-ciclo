const router = require('express').Router();
const UsuarioController = require('../../controllers/usuario.controller');
const multer = require('../../util/functions/multer');

const tokenVerify = require('../../util/jwt/tokenVerify');
const tokenRole = require('../../util/jwt/tokenRole');

const { validateUserRegister } = require("../../util/validators/usuarioRegistro.validator");
const { validateUserLogin } = require("../../util/validators/usuarioLogin.validator");
const { validatePacienteRegister } = require("../../util/validators/pacienteRegistro.validador");
const { validateEspecialistaRegister } = require("../../util/validators/especialistaRegistro.validator");

// Rutas POST
router.post('/usuario/registro',
    multer.none(),
    validateUserRegister,
    validatePacienteRegister,
    UsuarioController.postRegistro
);

router.post('/usuario/registro-especialista',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateUserRegister,
    validateEspecialistaRegister,
    UsuarioController.postRegistroEspecialista
);

router.post('/usuario/login',
    multer.none(),
    validateUserLogin,
    UsuarioController.postLogin
);

// Rutas PUT
router.put('/usuario/password',
    UsuarioController.postUpdatePassword
);

module.exports = router;