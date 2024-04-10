const router = require('express').Router();
const UsuarioController = require('../../controllers/usuario.controller');
const multer = require('../../util/multer');

// Rutas POST
router.post('/usuario/registro',
    multer.none(),
    UsuarioController.validateUsuario,
    UsuarioController.postRegistro);
router.post('/usuario/login',
    multer.none(),
    UsuarioController.validateUsuarioLogin,
    UsuarioController.postLogin);

// Rutas PUT
router.put('/usuario/password',
    UsuarioController.postUpdatePassword);

module.exports = router;