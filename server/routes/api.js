const router = require('express').Router();
const authentication = require('../middlewares/authenticate');
const authorization = require('../middlewares/authorization');

router.use('/medicamento', authentication, authorization([1, 3]), require('./api/medicamento.routes'));
router.use('/usuario', require('./api/usuario.routes'));

module.exports = router;