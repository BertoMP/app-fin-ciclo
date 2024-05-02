// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de tensionArterial
import TensionArterialController from '../../controllers/tensionArterial.controller.js';

// Importación de middlewares para la validación de roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';
import { verifyUserId } from '../../util/middleware/verifyUserId.js';

// Importación de middlewares para la validación de datos
import { validateTensionArterial } from '../../helpers/validators/tensionArterial.validator.js';
import { validatePaginationQueryParams } from '../../helpers/validators/queryParams/paginationQueryParams.validator.js';
import { validateDateQueryParams } from '../../helpers/validators/queryParams/dateQueryParams.validator.js';
import { validateUsuarioIdParam } from '../../helpers/validators/params/usuarioIdParam.validator.js';

// Rutas GET
/**
 * @swagger
 * /tension-arterial/{usuario_id}:
 *   get:
 *     summary: Obtiene las mediciones de tensión arterial de un usuario específico
 *     tags: [TensionArterial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de la página a obtener
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango de búsqueda
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango de búsqueda
 *     responses:
 *       200:
 *         description: Mediciones de tensión arterial obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TensionArterialPaginada'
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
 *         description: No se encontraron mediciones de tensión arterial para el usuario especificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Conflicto de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get(
	'/tension-arterial/:usuario_id',
	verifyAccessToken,
	verifyUserRole([3]),
	validateUsuarioIdParam,
	validatePaginationQueryParams,
	validateDateQueryParams,
	TensionArterialController.getTensionArterial,
);

/**
 * @swagger
 * /tension-arterial:
 *   get:
 *     summary: Obtiene las mediciones de tensión arterial de un usuario específico
 *     tags: [TensionArterial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de la página a obtener
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango de búsqueda
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del rango de búsqueda
 *     responses:
 *       200:
 *         description: Mediciones de tensión arterial obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TensionArterialPaginada'
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
 *         description: No se encontraron mediciones de tensión arterial para el usuario especificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Conflicto de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get(
	'/tension-arterial',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validatePaginationQueryParams,
	validateDateQueryParams,
	TensionArterialController.getTensionArterial,
);

// Rutas POST
/**
 * @swagger
 * /tension-arterial:
 *   post:
 *     summary: Crea una nueva medición de tensión arterial
 *     tags: [TensionArterial]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TensionArterialPost'
 *     responses:
 *       200:
 *         description: Medición de tensión arterial creada correctamente
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
	'/tension-arterial',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateTensionArterial,
	TensionArterialController.postTensionArterial,
);

// Exportación del router
export default router;
