// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de especialista
import EspecialidadController from '../../controllers/especialista.controller.js';

// Importación de middlewares para la validación de datos
import { validateUsuarioIdParam } from '../../helpers/validators/params/usuarioIdParam.validator.js';

// Rutas GET
/**
 * @swagger
 * /especialista/{usuario_id}:
 *   get:
 *     summary: Obtiene un especialista por su ID de usuario
 *     tags: [Especialista]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de usuario del especialista
 *     responses:
 *       200:
 *         description: El especialista solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialista'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: No se encontró el especialista
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
router.get(
	'/especialista/:usuario_id',
	validateUsuarioIdParam,
	EspecialidadController.getEspecialistaById,
);

// Exportación del router
export default router;
