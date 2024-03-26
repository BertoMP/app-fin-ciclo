const router = require('express').Router();
const userController = require('../../controllers/user.controller');

// Rutas POST
router.post('/login', userController.postLogin);
router.post('/register', userController.postRegister);

module.exports = router;