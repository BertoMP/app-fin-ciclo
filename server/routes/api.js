const router = require('express').Router();

const usuarioRoutes = require('./api/usuario.routes');
const medicamentoRoutes = require('./api/medicamento.routes');
const especialidadRoutes = require('./api/especialidad.routes');

router.use(usuarioRoutes);
router.use(medicamentoRoutes);
router.use(especialidadRoutes);

module.exports = router;