// Inicialización del router de express
const router                          = require('express').Router();

// Importación del controlador de glucometría
const GlucometriaController           = require('../../controllers/glucometria.controller');

// Importación de middlewares para la validación de token y roles
const tokenVerify                     = require('../../helpers/jwt/verifyAccessToken');
const tokenRole                       = require('../../util/middleware/verifyUserRole');
const tokenUserId                     = require('../../util/middleware/verifyUserId');

// Importación de middlewares para la validación de datos
const validateGlucometria             = require('../../helpers/validators/glucometria.validator');
const validatePaginationQueryParams   = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const validateDateQueryParams         = require("../../helpers/validators/queryParams/dateQueryParams.validator");
const validateUsuarioIdParam          = require("../../helpers/validators/params/usuarioIdParam.validator");

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
router.get('/glucometria/:usuario_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  validatePaginationQueryParams,
  validateDateQueryParams,
  GlucometriaController.getGlucometria);

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
router.get('/glucometria',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  validatePaginationQueryParams,
  validateDateQueryParams,
  GlucometriaController.getGlucometria);

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
router.post('/glucometria',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  validateGlucometria,
  GlucometriaController.postGlucometria);

// Exportación del router
module.exports = router;