// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de glucometría
import GlucometriaController from '../../controllers/glucometria.controller.js';

// Importación de middlewares para la validación de token y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';
import { verifyUserId } from '../../util/middleware/verifyUserId.js';

// Importación de middlewares para la validación de datos
import { validateGlucometria } from '../../helpers/validators/glucometria.validator.js';
import { validatePaginationQueryParams } from '../../helpers/validators/queryParams/paginationQueryParams.validator.js';
import { validateDateQueryParams } from '../../helpers/validators/queryParams/dateQueryParams.validator.js';
import { validateUsuarioIdParam } from '../../helpers/validators/params/usuarioIdParam.validator.js';

// Rutas GET
/**
 * @swagger
 * /glucometria/{usuario_id}:
 *   get:
 *     summary: Obtiene las glucometrías de un usuario por su ID
 *     tags: [Glucometria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del usuario
 *     responses:
 *       200:
 *         description: Las glucometrías del usuario solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlucometriaPaginada'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
 *         description: No se encontraron glucometrías para el usuario
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
	'/glucometria/:usuario_id',
	verifyAccessToken,
	verifyUserRole([3]),
	validateUsuarioIdParam,
	validatePaginationQueryParams,
	validateDateQueryParams,
	GlucometriaController.getGlucometria,
);

/**
 * @swagger
 * /glucometria:
 *   get:
 *     summary: Obtiene las glucometrías de un usuario por su ID
 *     tags: [Glucometria]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Las glucometrías del usuario solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlucometriaPaginada'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
 *         description: No se encontraron glucometrías para el usuario
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
	'/glucometria',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validatePaginationQueryParams,
	validateDateQueryParams,
	GlucometriaController.getGlucometria,
);

// Rutas POST
/**
 * @swagger
 * /glucometria:
 *   post:
 *     summary: Crea una nueva medición de glucosa para un usuario
 *     tags: [Glucometria]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GlucometriaPost'
 *     responses:
 *       200:
 *         description: La medición de glucosa fue creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post(
	'/glucometria',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateGlucometria,
	GlucometriaController.postGlucometria,
);

// Exportación del router
export default router;
