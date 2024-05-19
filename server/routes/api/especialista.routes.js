// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de especialista
import EspecialidadController from '../../controllers/especialista.controller.js';

// Importación de middlewares para la validación de datos
import { validateUsuarioIdParam } from '../../helpers/validators/params/usuarioIdParam.validator.js';
import {
	validateEspecialidadIdParam
} from "../../helpers/validators/params/especialidadIdParam.validator.js";
import {verifyAccessToken} from "../../helpers/jwt/verifyAccessToken.js";
import {verifyUserRole} from "../../util/middleware/verifyUserRole.js";
import {verifyUserId} from "../../util/middleware/verifyUserId.js";

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

/**
 * @swagger
 * /especialista/{especialidad_id}:
 *   get:
 *     summary: Obtiene los especialistas por su ID de especialidad
 *     tags: [Especialista]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: especialidad_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la especialidad
 *     responses:
 *       200:
 *         description: Los especialistas solicitados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Especialista'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: No se encontraron especialistas
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
	'/especialistas/:especialidad_id',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateEspecialidadIdParam,
	EspecialidadController.getEspecialistaByEspecialidad,
);

// Exportación del router
export default router;
