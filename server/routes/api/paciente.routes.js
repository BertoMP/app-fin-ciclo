// Inicialización del router de express
const router              = require('express').Router();

// Importación del controlador de paciente
const PacienteController  = require('../../controllers/paciente.controller');

// Importación de middlewares para la validación de datos
const tokenVerify         = require('../../helpers/jwt/verifyAccessToken');
const tokenRole           = require('../../util/middleware/verifyUserRole');

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
router.get('/paciente',
  tokenVerify,
  tokenRole([3]),
  PacienteController.getPacientes);

// Exportación del router
module.exports = router;