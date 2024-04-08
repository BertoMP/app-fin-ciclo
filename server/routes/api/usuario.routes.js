const router = require('express').Router();
const userController = require('../../controllers/usuario.controller');

// Rutas POST
router.post('/registro',
    userController.validateRegister,
    userController.postRegister);
router.post('/login',
    userController.validateLogin,
    userController.postLogin);

module.exports = router;