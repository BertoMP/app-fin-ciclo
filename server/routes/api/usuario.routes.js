const router = require('express').Router();
const UsuarioController = require('../../controllers/usuario.controller');
const multer = require('../../util/functions/multer');

const { cleanupFiles } = require("../../util/middleware/cleanupFiles");

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenUserId');

const { validateUserLogin } = require("../../helpers/validators/usuarioLogin.validator");
const { validatePacienteRegister } = require("../../helpers/validators/pacienteRegistro.validador");
const { validateEspecialistaRegister } = require("../../helpers/validators/especialistaRegistro.validator");
const { validateUserPasswordChange } = require("../../helpers/validators/usuarioPasswordChange.validator");

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

router.post('/usuario/refresh-token',
    UsuarioController.postRefreshToken
);

router.post('/usuario/logout',
    tokenVerify,
    tokenId,
    UsuarioController.postLogout);

// Rutas PUT
router.put('/usuario/password',
    validateUserPasswordChange,
    UsuarioController.postUpdatePassword
);

// Rutas DELETE
router.delete('/usuario/borrar-usuario',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    UsuarioController.deleteUsuario
);

module.exports = router;