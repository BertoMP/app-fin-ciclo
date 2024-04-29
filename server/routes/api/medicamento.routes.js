const router = require('express').Router();
const MedicamentoController =
  require('../../controllers/medicamento.controller');
const tokenVerify = require('../../helpers/jwt/tokenVerify');
const tokenRole = require('../../helpers/jwt/tokenRole');

const {validateMedicamento} = require('../../helpers/validators/medicamento.validator');
const {validatePaginationQueryParams} = require("../../helpers/validators/queryParams/paginationQueryParams.validator");
const {validateMedicamentoIdParam} = require("../../helpers/validators/params/medicamentoIdParam.validator");

// Rutas GET
/**
 * @swagger
 * /medicamento/prescripcion:
 *   get:
 *     summary: Obtiene una lista de medicamentos para prescripción
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La lista de medicamentos para prescripción
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicamentoPrescripcion'
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
router.get('/medicamento/prescripcion',
  tokenVerify,
  tokenRole([3]),
  MedicamentoController.getMedicamentosPrescripcion
);

/**
 * @swagger
 * /medicamento/{medicamento_id}:
 *   get:
 *     summary: Obtiene un medicamento por su ID
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicamento_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del medicamento
 *     responses:
 *       200:
 *         description: El medicamento solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicamento'
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
 *         description: No se encontró el medicamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Error de validación
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
router.get('/medicamento/:medicamento_id',
  tokenVerify,
  tokenRole([3]),
  validateMedicamentoIdParam,
  MedicamentoController.getMedicamentoById);

/**
 * @swagger
 * /medicamento:
 *   get:
 *     summary: Obtiene una lista paginada de medicamentos
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: El número de página
 *     responses:
 *       200:
 *         description: La lista de medicamentos solicitada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicamentoPaginado'
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
 *         description: La página de medicamentos solicitada no existe
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
router.get('/medicamento',
  tokenVerify,
  tokenRole([3]),
  validatePaginationQueryParams,
  MedicamentoController.getMedicamentos
);

// Rutas POST
/**
 * @swagger
 * /medicamento:
 *   post:
 *     summary: Crea un nuevo medicamento
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medicamento'
 *     responses:
 *       200:
 *         description: Medicamento creado correctamente
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
 *         description: Ya existe un medicamento con ese nombre
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
router.post('/medicamento',
  tokenVerify,
  tokenRole([3]),
  validateMedicamento,
  MedicamentoController.createMedicamento);


// Rutas PUT
/**
 * @swagger
 * /medicamento/{medicamento_id}:
 *   put:
 *     summary: Actualiza un medicamento existente
 *     tags: [Medicamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicamento_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del medicamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medicamento'
 *     responses:
 *       200:
 *         description: Medicamento actualizado correctamente
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
 *         description: El medicamento no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Ya existe un medicamento con ese nombre
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
router.put('/medicamento/:medicamento_id',
  tokenVerify,
  tokenRole([3]),
  validateMedicamentoIdParam,
  validateMedicamento,
  MedicamentoController.updateMedicamento);


module.exports = router;