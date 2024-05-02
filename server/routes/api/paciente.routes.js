// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de paciente
import PacienteController from '../../controllers/paciente.controller.js';

// Importación de middlewares para la validación de datos
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';

// Rutas GET
/**
 * @swagger
 * /paciente:
 *   get:
 *     summary: Obtiene una lista de pacientes
 *     tags: [Paciente]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La lista de pacientes solicitada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PacienteHistoria'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenExpiredError'
 *       403:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: No se encontraron pacientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get('/paciente', verifyAccessToken, verifyUserRole([3]), PacienteController.getPacientes);

// Exportación del router
export default router;
