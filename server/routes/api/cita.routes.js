// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de citas
import CitaController from '../../controllers/cita.controller.js';

// Importación de middlewares para la validación de tokens y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';
import { verifyUserId } from '../../util/middleware/verifyUserId.js';

// Importación de middlewares para la validación de datos
import { validateCita } from '../../helpers/validators/cita.validator.js';
import { validateCitaIdParam } from '../../helpers/validators/params/citaIdParam.validator.js';
import { validateQueryParams } from '../../helpers/validators/queryParams/queryParams.validator.js';

// Rutas GET
/**
 * @swagger
 * /cita/agenda:
 *   get:
 *     summary: Obtiene las citas de la agenda del especialista
 *     tags: [Cita]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La lista de citas de la agenda
 *         content:
 *           application/json:
 *             schema:
 *               type: 'array'
 *               items:
 *                 $ref: '#/components/schemas/AgendaItem'
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
 *         description: No se encontraron citas
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
	'/cita/agenda',
	verifyAccessToken,
	verifyUserRole([3]),
	verifyUserId,
	CitaController.getCitasAgenda,
);

/**
 * @swagger
 * /cita/citas-disponibles:
 *   get:
 *     summary: Obtiene las citas disponibles
 *     tags: [Cita]
 *     security:
 *       - bearerAuth: []
 *     description: Método asíncrono que obtiene citas disponibles de la base de datos.
 *     parameters:
 *       - in: query
 *         name: fechaCita
 *         schema:
 *           type: string
 *           format: date
 *         description: La fecha de la cita
 *       - in: query
 *         name: especialistaId
 *         schema:
 *           type: integer
 *         description: El ID del especialista
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: La página de resultados
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: El límite de resultados
 *     responses:
 *       '200':
 *         description: Operación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prev:
 *                   type: string
 *                   description: URL de la página anterior
 *                 next:
 *                   type: string
 *                   description: URL de la próxima página
 *                 pagina_actual:
 *                   type: integer
 *                   description: La página actual
 *                 paginas_totales:
 *                   type: integer
 *                   description: El total de páginas
 *                 cantidad_citas:
 *                   type: integer
 *                   description: El total de citas
 *                 result_min:
 *                   type: integer
 *                   description: El resultado mínimo
 *                 result_max:
 *                   type: integer
 *                   description: El resultado máximo
 *                 items_pagina:
 *                   type: integer
 *                   description: Los elementos por página
 *                 datos_agenda:
 *                   type: object
 *                   properties:
 *                     fecha_cita:
 *                       type: string
 *                       format: string
 *                       description: La fecha de la cita
 *                     especialista_id:
 *                       type: integer
 *                       description: El ID del especialista
 *                     citas_disponibles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Las citas disponibles
 *       '404':
 *         description: El especialista seleccionado no existe
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
	'/cita/citas-disponibles',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateQueryParams,
	CitaController.getCitasDisponibles,
);

/**
 * @swagger
 * /cita/pdf/{cita_id}:
 *   get:
 *     summary: Obtiene el PDF de una cita específica
 *     tags: [Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cita_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la cita
 *     responses:
 *       200:
 *         description: El PDF de la cita
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
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
 *         description: Token inválido o no proporcionado // No tienes permiso para obtener este PDF
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: No se encontró la cita
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
	'/cita/pdf/:cita_id',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateCitaIdParam,
	CitaController.getCitaPdf,
);

/**
 * @swagger
 * /cita/{cita_id}:
 *   get:
 *     summary: Obtiene los detalles de una cita específica
 *     tags: [Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cita_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la cita
 *     responses:
 *       200:
 *         description: Los detalles de la cita
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CitaItem'
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
 *         description: Token inválido o no proporcionado // No tienes permiso para obtener esta cita
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: No se encontró la cita
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
	'/cita/:cita_id',
	verifyAccessToken,
	verifyUserRole([2, 3]),
	verifyUserId,
	validateCitaIdParam,
	CitaController.getCitaById,
);

/**
 * @swagger
 * /cita:
 *   get:
 *     summary: Obtiene las citas del paciente con paginación
 *     tags: [Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *         required: false
 *         description: Fecha de inicio del rango de búsqueda
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *         required: false
 *         description: Fecha de fin del rango de búsqueda
 *     responses:
 *       200:
 *         description: Los detalles de las citas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CitaPaginada'
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
 *         description: No se encontraron citas
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
	'/cita',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateQueryParams,
	CitaController.getCitas,
);

// Rutas POST
/**
 * @swagger
 * /cita:
 *   post:
 *     summary: Crea una nueva cita
 *     tags: [Cita]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paciente_id
 *               - especialista_id
 *               - fecha
 *               - hora
 *             properties:
 *               paciente_id:
 *                 type: integer
 *                 description: El ID del paciente
 *               especialista_id:
 *                 type: integer
 *                 description: El ID del especialista
 *               fecha:
 *                 type: string
 *                 description: La fecha de la cita
 *               hora:
 *                 type: string
 *                 description: La hora de la cita
 *     responses:
 *       200:
 *         description: Cita creada correctamente
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
 *         description: La cita que se intenta generar no está disponible
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post(
	'/cita',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateCita,
	CitaController.createCita,
);

// Rutas DELETE
/**
 * @swagger
 * /cita/{cita_id}:
 *   delete:
 *     summary: Elimina una cita específica
 *     tags: [Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cita_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada correctamente
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
 *         description: Token inválido o no proporcionado // No tienes permiso para eliminar esta cita
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: No se encontró la cita
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
	'/cita/:cita_id',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateCitaIdParam,
	CitaController.deleteCita,
);

// Exportación del router
export default router;
