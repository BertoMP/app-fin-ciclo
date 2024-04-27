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
const { validateRoleQueryParams } = require("../../helpers/validators/queryParams/roleQueryParams.validator");
const { validateUsuarioIdParam } = require("../../helpers/validators/params/usuarioIdParam.validator");


// Rutas GET
router.get('/usuario/:usuario_id',
    tokenVerify,
    tokenRole([1]),
    validateUsuarioIdParam,
    UsuarioController.getUsuario
);

router.get('/usuario',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    UsuarioController.getUsuario
);

router.get('/usuario/listado',
    tokenVerify,
    tokenRole([1]),
    validateRoleQueryParams,
    UsuarioController.getListado
);

// Rutas POST
router.post('/usuario/registro',
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
    validateUserLogin,
    UsuarioController.postLogin
);

router.post('/usuario/contrasena-olvidada',
    UsuarioController.postForgotPassword
);

router.post('/usuario/contrasena-reset',
    validateUserPasswordChange,
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
router.put('/usuario/actualizar-password',
    tokenVerify,
    tokenId,
    validateUserPasswordChange,
    UsuarioController.postUpdatePassword
);

router.put('/usuario/actualizar-usuario/:usuario_id',
    tokenVerify,
    tokenRole([1]),
    validateUsuarioIdParam,
    UsuarioController.putUsuarioPaciente
);

router.put('/usuario/actualizar-usuario',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    UsuarioController.putUsuarioPaciente
);

router.put('/usuario/actualizar-especialista/:usuario_id',
    tokenVerify,
    tokenRole([1]),
    multer.single('imagen'),
    validateUsuarioIdParam,
    UsuarioController.putUsuarioEspecialista
);

// Rutas DELETE
router.delete('/usuario/borrar-usuario',
    tokenVerify,
    tokenRole([2]),
    tokenId,
    UsuarioController.deleteUsuario
);

module.exports = router;