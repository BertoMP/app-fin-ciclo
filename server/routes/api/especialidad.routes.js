// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de especialidad
import EspecialidadController from '../../controllers/especialidad.controller.js';

// Importación de middlewares para la validación de token y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';

// Importación de middlewares para la validación de datos
import { validateEspecialidad } from '../../helpers/validators/especialidad.validator.js';
import { validateEspecialidadIdParam } from '../../helpers/validators/params/especialidadIdParam.validator.js';
import { validateQueryParams } from '../../helpers/validators/queryParams/queryParams.validator.js';

// Rutas GET
/**
 * @swagger
 * /especialidad/especialista:
 *   get:
 *     summary: Obtiene una lista de todas las especialidades y sus especialistas
 *     tags: [Especialidad]
 *     responses:
 *       200:
 *         description: La lista de especialidades y especialistas
 *         content:
 *           application/json:
 *             schema:
 *               type: 'array'
 *               items:
 *                 type: 'object'
 *                 properties:
 *                   id:
 *                     type: 'integer'
 *                     description: 'El ID de la especialidad'
 *                   nombre:
 *                     type: 'string'
 *                     description: 'El nombre de la especialidad'
 *                   especialistas:
 *                     type: 'array'
 *                     items:
 *                       type: 'object'
 *                       properties:
 *                         id:
 *                           type: 'integer'
 *                           description: 'El ID del especialista'
 *                         nombre:
 *                           type: 'string'
 *                           description: 'El nombre del especialista'
 *                         primer_apellido:
 *                           type: 'string'
 *                           description: 'El primer apellido del especialista'
 *                         segundo_apellido:
 *                           type: 'string'
 *                           description: 'El segundo apellido del especialista'
 *                         imagen:
 *                           type: 'string'
 *                           description: 'La URL de la imagen del especialista'
 *       404:
 *         description: No se encontraron especialidades con especialistas
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
	'/especialidad/especialista',
	EspecialidadController.getEspecialidadesEspecialistas
);

/**
 * @swagger
 * /especialidad/listado:
 *   get:
 *     summary: Obtiene una lista de todas las especialidades
 *     tags: [Especialidad]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               type: 'array'
 *               items:
 *                 type: 'object'
 *                 properties:
 *                   id:
 *                     type: 'integer'
 *                     description: 'El ID de la especialidad'
 *                   nombre:
 *                     type: 'string'
 *                     description: 'El nombre de la especialidad'
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
	'/especialidad/listado',
	verifyAccessToken,
	verifyUserRole([1, 2]),
	EspecialidadController.getEspecialidadesListado
);

/**
 * @swagger
 * /especialidad/{especialidad_id}:
 *   get:
 *     summary: Obtiene una especialidad por su ID
 *     tags: [Especialidad]
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
 *         description: La especialidad solicitada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EspecialidadItem'
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
 *         description: No se encontró la especialidad
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
	'/especialidad/:especialidad_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateEspecialidadIdParam,
	EspecialidadController.getEspecialidadById,
);

/**
 * @swagger
 * /especialidad:
 *   get:
 *     summary: Obtiene una lista paginada de especialidades
 *     tags: [Especialidad]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: El número de la página a obtener
 *     responses:
 *       200:
 *         description: La lista de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EspecialidadPaginada'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: No se encontró la página de especialidades
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Ya existe una especialidad con ese nombre
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
	'/especialidad',
	validateQueryParams,
	EspecialidadController.getEspecialidades,
);

// Rutas POST
/**
 * @swagger
 * /especialidad:
 *   post:
 *     summary: Crea una nueva especialidad
 *     tags: [Especialidad]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre de la especialidad
 *               descripcion:
 *                 type: string
 *                 description: La descripción de la especialidad
 *               imagen:
 *                 type: string
 *                 description: La URL de la imagen de la especialidad
 *     responses:
 *       200:
 *         description: Especialidad creada correctamente
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
 *         description: Ya existe una especialidad con ese nombre
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
	'/especialidad',
	verifyAccessToken,
	verifyUserRole([1]),
	validateEspecialidad,
	EspecialidadController.createEspecialidad,
);

// Rutas PUT
/**
 * @swagger
 * /especialidad/{especialidad_id}:
 *   put:
 *     summary: Actualiza una especialidad existente
 *     tags: [Especialidad]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: especialidad_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la especialidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre de la especialidad
 *               descripcion:
 *                 type: string
 *                 description: La descripción de la especialidad
 *               imagen:
 *                 type: string
 *                 description: La URL de la imagen de la especialidad
 *     responses:
 *       200:
 *         description: Especialidad actualizada correctamente
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
 *         description: No se encontró la especialidad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Ya existe una especialidad con ese nombre
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
	'/especialidad/:especialidad_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateEspecialidadIdParam,
	validateEspecialidad,
	EspecialidadController.updateEspecialidad,
);

// Rutas DELETE
/**
 * @swagger
 * /especialidad/{especialidad_id}:
 *   delete:
 *     summary: Elimina una especialidad existente
 *     tags: [Especialidad]
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
 *         description: Especialidad eliminada correctamente
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
 *         description: No se encontró la especialidad
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
router.delete(
	'/especialidad/:especialidad_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateEspecialidadIdParam,
	EspecialidadController.deleteEspecialidad,
);

// Exportación del router
export default router;
