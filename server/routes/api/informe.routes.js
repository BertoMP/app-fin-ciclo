const router = require('express').Router();
const InformeController = require('../../controllers/informe.controller');

const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');
const tokenId = require('../../helpers/jwt/tokenUserId');

const {validateInforme} = require("../../helpers/validators/informe.validator");
const {validateInformeIdParam} = require("../../helpers/validators/params/informeIdParam.validator");

// Rutas GET
/**
 * @swagger
 * /informe/pdf/{informe_id}:
 *   get:
 *     summary: Obtiene el PDF de un informe por su ID
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: informe_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del informe
 *     responses:
 *       200:
 *         description: El PDF del informe solicitado
 *         content:
 *           application/pdf:
 *             schema:
 *               $ref: '#/components/schemas/InformePDF'
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
 *         description: No se encontró el informe
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
router.get('/informe/pdf/:informe_id',
  tokenVerify,
  tokenRole([2, 3]),
  tokenId,
  validateInformeIdParam,
  InformeController.generaInformePDF);

/**
 * @swagger
 * /informe/{informe_id}:
 *   get:
 *     summary: Obtiene un informe por su ID
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: informe_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del informe
 *     responses:
 *       200:
 *         description: El informe solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Informe'
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
 *         description: No se encontró el informe
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
router.get('/informe/:informe_id',
  tokenVerify,
  tokenRole([2, 3]),
  tokenId,
  validateInformeIdParam,
  InformeController.getInforme);

// Rutas POST
/**
 * @swagger
 * /informe:
 *   post:
 *     summary: Crea un nuevo informe
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InformePost'
 *     responses:
 *       200:
 *         description: Informe creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Datos de entrada inválidos
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
router.post('/informe',
  tokenVerify,
  tokenRole([3]),
  validateInforme,
  InformeController.createInforme);

module.exports = router;