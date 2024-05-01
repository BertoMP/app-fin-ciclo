// Inicialización del router de express
const router                              = require('express').Router();

// Importación del controlador de pacienteTomaMedicamento
const PacienteTomaMedicamentoController   = require('../../controllers/pacienteTomaMedicamento.controller');

// Importación de middlewares para la validación de token y roles
const tokenVerify                         = require('../../helpers/jwt/verifyAccessToken');
const tokenRole                           = require('../../util/middleware/verifyUserRole');
const tokenUserId                         = require('../../util/middleware/verifyUserId');

// Importación de middlewares para la validación de datos
const {validatePacienteTomaMedicamento}   = require('../../helpers/validators/pacienteTomaMedicamento.validator');
const {validateUsuarioIdParam}            = require("../../helpers/validators/params/usuarioIdParam.validator");
const {validateTomaIdParam}               = require("../../helpers/validators/params/tomaIdParam");
const {validateMedicamentoIdParam}        = require("../../helpers/validators/params/medicamentoIdParam.validator");

// Rutas GET
/**
 * @swagger
 * /prescripcion/pdf/{usuario_id}:
 *   get:
 *     summary: Obtiene un PDF con las prescripciones de un usuario
 *     tags: [PacienteTomaMedicamento]
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
 *         description: PDF generado correctamente
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
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: No hay recetas para este paciente
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
router.get('/prescripcion/pdf/:usuario_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  PacienteTomaMedicamentoController.getRecetaPDF);

/**
 * @swagger
 * /prescripcion/pdf:
 *   get:
 *     summary: Obtiene un PDF con las prescripciones de un usuario
 *     tags: [PacienteTomaMedicamento]
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
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
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
 *         description: No hay recetas para este paciente
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
router.get('/prescripcion/pdf',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  PacienteTomaMedicamentoController.getRecetaPDF);

/**
 * @swagger
 * /prescripcion/{usuario_id}:
 *   get:
 *     summary: Obtiene las prescripciones de un usuario
 *     tags: [PacienteTomaMedicamento]
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
 *         description: Prescripciones obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 datos_paciente:
 *                   $ref: '#/components/schemas/Paciente'
 *                 prescripciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prescripcion'
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
 *         description: No hay recetas para este paciente
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
router.get('/prescripcion/:usuario_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  PacienteTomaMedicamentoController.getRecetas);

/**
 * @swagger
 * /prescripcion:
 *   get:
 *     summary: Obtiene las prescripciones de un paciente
 *     tags: [Prescripciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La lista de prescripciones del paciente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescripcion'
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
 *         description: No hay recetas para este paciente
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
router.get('/prescripcion',
  tokenVerify,
  tokenRole([2]),
  tokenUserId,
  PacienteTomaMedicamentoController.getRecetas);

// Rutas POST
/**
 * @swagger
 * /prescripcion:
 *   post:
 *     summary: Crea una nueva prescripción para un paciente
 *     tags: [PacienteTomaMedicamento]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paciente_id:
 *                 type: integer
 *                 description: El ID del paciente
 *               prescripcion:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medicamento_id:
 *                       type: integer
 *                       description: El ID del medicamento
 *                     tomas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           toma_id:
 *                             type: integer
 *                             description: El ID de la toma
 *                           dosis:
 *                             type: number
 *                             description: La dosis del medicamento
 *                           hora:
 *                             type: string
 *                             description: La hora de la toma
 *                           fecha_inicio:
 *                             type: string
 *                             description: La fecha de inicio de la toma
 *                           fecha_fin:
 *                             type: string
 *                             description: La fecha de fin de la toma
 *                           observaciones:
 *                             type: string
 *                             description: Observaciones adicionales
 *     responses:
 *       200:
 *         description: Prescripción creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescripcion'
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
router.post('/prescripcion',
  tokenVerify,
  tokenRole([3]),
  validatePacienteTomaMedicamento,
  PacienteTomaMedicamentoController.postReceta);

// Rutas DELETE
/**
 * @swagger
 * /prescripcion/borrar-toma/{toma_id}:
 *   delete:
 *     summary: Elimina una toma específica de la prescripción de un paciente
 *     tags: [PacienteTomaMedicamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: toma_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la toma
 *     responses:
 *       200:
 *         description: Toma eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Toma eliminada correctamente
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
 *         description: Toma no encontrada
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
router.delete('/prescripcion/borrar-toma/:toma_id',
  tokenVerify,
  tokenRole([3]),
  validateTomaIdParam,
  PacienteTomaMedicamentoController.deleteToma);

/**
 * @swagger
 * /prescripcion/borrar-medicamento/{usuario_id}/{medicamento_id}:
 *   delete:
 *     summary: Elimina un medicamento específico de la prescripción de un paciente
 *     tags: [PacienteTomaMedicamento]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del usuario
 *       - in: path
 *         name: medicamento_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del medicamento
 *     responses:
 *       200:
 *         description: Medicamento eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medicamento eliminado correctamente
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
 *         description: Medicamento no encontrado
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
router.delete('/prescripcion/borrar-medicamento/:usuario_id/:medicamento_id',
  tokenVerify,
  tokenRole([3]),
  validateUsuarioIdParam,
  validateMedicamentoIdParam,
  PacienteTomaMedicamentoController.deleteMedicamento);

// Exportación del router
module.exports = router;