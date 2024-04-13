const router = require('express').Router();

const usuarioRoutes = require('./api/usuario.routes');
const medicamentoRoutes = require('./api/medicamento.routes');
const especialidadRoutes = require('./api/especialidad.routes');
const contactoRoutes = require('./api/contacto.routes');

router.use(usuarioRoutes);
router.use(medicamentoRoutes);
router.use(especialidadRoutes);
router.use(contactoRoutes);

module.exports = router;