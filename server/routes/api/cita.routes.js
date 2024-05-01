// Inicialización del router de express
const router                            = require('express').Router();

// Importación del controlador de citas
const CitaController                    = require('../../controllers/cita.controller');

// Importación de middlewares para la validación de tokens y roles
const tokenVerify                       = require('../../helpers/jwt/verifyAccessToken');
const tokenRole                         = require('../../util/middleware/verifyUserRole');
const tokenUserId                       = require('../../util/middleware/verifyUserId');

// Importación de middlewares para la validación de datos
const {validateCita}                    = require("../../helpers/validators/cita.validator");
const {validateCitaIdParam}             = require("../../helpers/validators/params/citaIdParam.validator");
const {validatePaginationQueryParams}   = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const {validateDateQueryParams}         = require("../../helpers/validators/queryParams/dateQueryParams.validator");

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
router.get('/cita/agenda',
  tokenVerify,
  tokenRole([3]),
  tokenUserId,
  CitaController.getCitasAgenda);

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
router.get('/cita/:cita_id',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  validateCitaIdParam,
  CitaController.getCitaById);

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
router.get('/cita',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  validatePaginationQueryParams,
  validateDateQueryParams,
  CitaController.getCitas);

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
router.post('/cita',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  validateCita,
  CitaController.createCita);

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
router.delete('/cita/:cita_id',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  validateCitaIdParam,
  CitaController.deleteCita);

// Exportación del router
module.exports = router;