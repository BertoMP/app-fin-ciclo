// Inicialización del router de express
const router                            = require('express').Router();

// Importación del controlador de tensionArterial
const TensionArterialController         = require('../../controllers/tensionArterial.controller');

// Importación de middlewares para la validación de roles
const tokenVerify                       = require('../../helpers/jwt/tokenVerify');
const tokenRole                         = require('../../helpers/jwt/tokenRole');
const tokenId                           = require('../../helpers/jwt/tokenUserId');

// Importación de middlewares para la validación de datos
const {validateTensionArterial}         = require('../../helpers/validators/tensionArterial.validator');
const {validatePaginationQueryParams}   = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const {validateDateQueryParams}         = require('../../helpers/validators/queryParams/dateQueryParams.validator');
const {validateUsuarioIdParam}          = require('../../helpers/validators/params/usuarioIdParam.validator');

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
router.get('/tension-arterial/:usuario_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  validatePaginationQueryParams,
  validateDateQueryParams,
  TensionArterialController.getTensionArterial);

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
router.get('/tension-arterial',
  tokenVerify,
  tokenRole([2]),
  tokenId,
  validatePaginationQueryParams,
  validateDateQueryParams,
  TensionArterialController.getTensionArterial);

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
router.post('/tension-arterial',
  tokenVerify,
  tokenRole([2]),
  tokenId,
  validateTensionArterial,
  TensionArterialController.postTensionArterial);

// Exportación del router
module.exports = router;