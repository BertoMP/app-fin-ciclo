// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de consulta
import ConsultaController from '../../controllers/consulta.controller.js';

// Importación de middlewares para la validación de token y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';

// Importación de middlewares para la validación de datos
import { validateConsulta } from '../../helpers/validators/consulta.validator.js';
import { validateConsultaIdParam } from '../../helpers/validators/params/consultaIdParam.validator.js';
import { validateQueryParams } from "../../helpers/validators/queryParams/queryParams.validator.js";

// Rutas GET
/**
 * @swagger
 * /consulta/listado:
 *   get:
 *     summary: Obtiene una lista de consultas
 *     tags: [Consulta]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La lista de consultas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultaListado'
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
	'/consulta/listado',
	verifyAccessToken,
	verifyUserRole([1]),
	ConsultaController.getConsultaListado,
);

/**
 * @swagger
 * /consulta:
 *   get:
 *     summary: Obtiene una lista paginada de consultas
 *     tags: [Consulta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: El número de la página a obtener
 *     responses:
 *       200:
 *         description: La lista de consultas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultaPaginada'
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
 *         description: No se encontró la página de consultas
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
	'/consulta',
	verifyAccessToken,
	verifyUserRole([1]),
	validateQueryParams,
	ConsultaController.getConsultas
);

/**
 * @swagger
 * /consulta/{consulta_id}:
 *   get:
 *     summary: Obtiene los detalles de una consulta específica
 *     tags: [Consulta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consulta_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la consulta
 *     responses:
 *       200:
 *         description: Los detalles de la consulta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultaItem'
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
 *         description: No se encontró la consulta
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
	'/consulta/:consulta_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateConsultaIdParam,
	ConsultaController.getConsultaById,
);

// Rutas POST
/**
 * @swagger
 * /consulta:
 *   post:
 *     summary: Crea una nueva consulta
 *     tags: [Consulta]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               nombre:
 *                 type: 'string'
 *                 description: 'El nombre de la consulta'
 *     responses:
 *       200:
 *         description: Consulta creada correctamente
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
 *         description: Ya existe una consulta con ese nombre
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
	'/consulta',
	verifyAccessToken,
	verifyUserRole([1]),
	validateConsulta,
	ConsultaController.createConsulta,
);

// Rutas PUT
/**
 * @swagger
 * /consulta/{consulta_id}:
 *   put:
 *     summary: Actualiza una consulta existente
 *     tags: [Consulta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consulta_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la consulta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             properties:
 *               nombre:
 *                 type: 'string'
 *                 description: 'El nuevo nombre de la consulta'
 *     responses:
 *       200:
 *         description: Consulta actualizada correctamente
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
 *         description: No se encontró la consulta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Ya existe una consulta con ese nombre
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
	'/consulta/:consulta_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateConsultaIdParam,
	validateConsulta,
	ConsultaController.updateConsulta,
);

// Rutas DELETE
/**
 * @swagger
 * /consulta/{consulta_id}:
 *   delete:
 *     summary: Elimina una consulta existente
 *     tags: [Consulta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consulta_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la consulta
 *     responses:
 *       200:
 *         description: Consulta eliminada correctamente
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
 *         description: No se encontró la consulta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: No se puede eliminar la consulta porque está asociada a un médico
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
router.delete(
	'/consulta/:consulta_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateConsultaIdParam,
	ConsultaController.deleteConsulta,
);

// Exportación del router
export default router;
