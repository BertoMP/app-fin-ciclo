// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de patología
import PatologiaController from '../../controllers/patologia.controller.js';

// Importación de middlewares para la validación de token y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';

// Importación de middlewares para la validación de datos
import { validatePaginationQueryParams } from '../../helpers/validators/queryParams/paginationQueryParams.validator.js';
import { validatePatologia } from '../../helpers/validators/patologia.validator.js';

// Ruta GET
/**
 * @swagger
 * /patologia/informe:
 *   get:
 *     summary: Obtiene todas las patologías para informes
 *     tags: [Patologia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de patologías obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: El ID de la patología
 *                   nombre:
 *                     type: string
 *                     description: El nombre de la patología
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
router.get(
	'/patologia/informe',
	verifyAccessToken,
	verifyUserRole([3]),
	PatologiaController.getPatologiasInforme,
);

/**
 * @swagger
 * /patologia/{patologia_id}:
 *   get:
 *     summary: Obtiene una patología específica por su ID
 *     tags: [Patologia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patologia_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la patología
 *     responses:
 *       200:
 *         description: Patología obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: El ID de la patología
 *                 nombre:
 *                   type: string
 *                   description: El nombre de la patología
 *                 descripcion:
 *                   type: string
 *                   description: La descripción de la patología
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
 *         description: Patología no encontrada
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
	'/patologia/:patologia_id',
	verifyAccessToken,
	verifyUserRole([3]),
	PatologiaController.getPatologiaById,
);

/**
 * @swagger
 * /patologia:
 *   get:
 *     summary: Obtiene todas las patologías paginadas
 *     tags: [Patologia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de la página a obtener
 *     responses:
 *       200:
 *         description: Lista de patologías obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatologiaPaginada'
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
 *         description: Página de patología no encontrada
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
	'/patologia',
	verifyAccessToken,
	verifyUserRole([3]),
	validatePaginationQueryParams,
	PatologiaController.getPatologias,
);

// Ruta POST
/**
 * @swagger
 * /patologia:
 *   post:
 *     summary: Crea una nueva patología
 *     tags: [Patologia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patologia'
 *     responses:
 *       200:
 *         description: Patología creada correctamente
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
 *       409:
 *         description: La patología ya existe
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
router.post(
	'/patologia',
	verifyAccessToken,
	verifyUserRole([3]),
	validatePatologia,
	PatologiaController.createPatologia,
);

// Ruta PUT
/**
 * @swagger
 * /patologia/{patologia_id}:
 *   put:
 *     summary: Actualiza una patología existente
 *     tags: [Patologia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patologia_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID de la patología a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patologia'
 *     responses:
 *       200:
 *         description: Patología actualizada correctamente
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
 *       404:
 *         description: La patología solicitada no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Ya existe una patología con ese nombre
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
router.put(
	'/patologia/:patologia_id',
	verifyAccessToken,
	verifyUserRole([3]),
	validatePatologia,
	PatologiaController.updatePatologia,
);

// Exportación del router
export default router;
