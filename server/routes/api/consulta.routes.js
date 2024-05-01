// Inicialización del router de express
const router                      = require('express').Router();

// Importación del controlador de consulta
const ConsultaController          = require('../../controllers/consulta.controller');

// Importación de middlewares para la validación de token y roles
const tokenVerify                 = require('../../helpers/jwt/verifyToken');
const tokenRole                   = require('../../util/middleware/verifyUserRole');

// Importación de middlewares para la validación de datos
const {validateConsulta}          = require("../../helpers/validators/consulta.validator");
const {validateConsultaIdParam}   = require("../../helpers/validators/params/consultaIdParam.validator");

// Rutas GET
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
router.get('/consulta/:consulta_id',
  tokenVerify,
  tokenRole([1]),
  validateConsultaIdParam,
  ConsultaController.getConsultaById);

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
router.get('/consulta',
  tokenVerify,
  tokenRole([1]),
  ConsultaController.getConsultas);

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
router.post('/consulta',
  tokenVerify,
  tokenRole([1]),
  validateConsulta,
  ConsultaController.createConsulta);

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
router.put('/consulta/:consulta_id',
  tokenVerify,
  tokenRole([1]),
  validateConsultaIdParam,
  validateConsulta,
  ConsultaController.updateConsulta);

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
router.delete('/consulta/:consulta_id',
  tokenVerify,
  tokenRole([1]),
  validateConsultaIdParam,
  ConsultaController.deleteConsulta);

// Exportación del router
module.exports = router;