const router = require('express').Router();

const usuarioRoutes = require('./api/usuario.routes');
const medicamentoRoutes = require('./api/medicamento.routes');
const especialidadRoutes = require('./api/especialidad.routes');
const contactoRoutes = require('./api/contacto.routes');
const glucometriaRoutes = require('./api/glucometria.routes');
const tensionArterialRoutes = require('./api/tensionArterial.routes');
const provinciaRoutes = require('./api/provincia.routes');
const municipioRoutes = require('./api/municipio.routes');
const tipoViaRoutes = require('./api/tipoVia.routes');
const consultaRoutes = require('./api/consulta.routes');

router.use(usuarioRoutes);
router.use(medicamentoRoutes);
router.use(especialidadRoutes);
router.use(contactoRoutes);
router.use(glucometriaRoutes);
router.use(tensionArterialRoutes);
router.use(provinciaRoutes);
router.use(municipioRoutes);
router.use(tipoViaRoutes);
router.use(consultaRoutes);

module.exports = router;