// Inicialización del router de express
const router                          = require('express').Router();

// Importación de rutas de la API
const citaRoutes                      = require('./api/cita.routes');
const codigoPostalMunicipioRoutes     = require('./api/codigoPostalMunicipio.routes');
const consultaRoutes                  = require('./api/consulta.routes');
const contactoRoutes                  = require('./api/contacto.routes');
const especialidadRoutes              = require('./api/especialidad.routes');
const especialistaRoutes              = require('./api/especialista.routes');
const glucometriaRoutes               = require('./api/glucometria.routes');
const informeRoutes                   = require('./api/informe.routes');
const medicamentoRoutes               = require('./api/medicamento.routes');
const municipioRoutes                 = require('./api/municipio.routes');
const pacienteRoutes                  = require('./api/paciente.routes');
const pacienteMedicamentoTomaRoutes   = require('./api/pacienteTomaMedicamento.routes');
const patologiaRoutes                 = require('./api/patologia.routes');
const provinciaRoutes                 = require('./api/provincia.routes');
const tensionArterialRoutes           = require('./api/tensionArterial.routes');
const tipoViaRoutes                   = require('./api/tipoVia.routes');
const usuarioRoutes                   = require('./api/usuario.routes');

// Uso de las rutas de la API
router.use(citaRoutes);
router.use(codigoPostalMunicipioRoutes);
router.use(consultaRoutes);
router.use(contactoRoutes);
router.use(especialidadRoutes);
router.use(especialistaRoutes);
router.use(glucometriaRoutes);
router.use(informeRoutes);
router.use(medicamentoRoutes);
router.use(municipioRoutes);
router.use(pacienteRoutes);
router.use(pacienteMedicamentoTomaRoutes);
router.use(patologiaRoutes);
router.use(provinciaRoutes);
router.use(tensionArterialRoutes);
router.use(tipoViaRoutes);
router.use(usuarioRoutes);

// Exportación del router
module.exports = router;