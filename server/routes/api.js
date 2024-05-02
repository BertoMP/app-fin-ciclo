// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación de rutas de la API
import citaRoutes from './api/cita.routes.js';
import codigoPostalMunicipioRoutes from './api/codigoPostalMunicipio.routes.js';
import consultaRoutes from './api/consulta.routes.js';
import contactoRoutes from './api/contacto.routes.js';
import especialidadRoutes from './api/especialidad.routes.js';
import especialistaRoutes from './api/especialista.routes.js';
import glucometriaRoutes from './api/glucometria.routes.js';
import informeRoutes from './api/informe.routes.js';
import medicamentoRoutes from './api/medicamento.routes.js';
import municipioRoutes from './api/municipio.routes.js';
import pacienteRoutes from './api/paciente.routes.js';
import pacienteMedicamentoTomaRoutes from './api/pacienteTomaMedicamento.routes.js';
import patologiaRoutes from './api/patologia.routes.js';
import provinciaRoutes from './api/provincia.routes.js';
import tensionArterialRoutes from './api/tensionArterial.routes.js';
import tipoViaRoutes from './api/tipoVia.routes.js';
import usuarioRoutes from './api/usuario.routes.js';

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
export default router;
