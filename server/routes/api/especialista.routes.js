const router = require('express').Router();
const EspecialistaController = require('../../controllers/especialista.controller');

const {validateUsuarioIdParam} = require("../../helpers/validators/params/usuarioIdParam.validator");

// Rutas GET
/**
 * @swagger
 * /especialista/{usuario_id}:
 *   get:
 *     summary: Obtiene un especialista por su ID de usuario
 *     tags: [Especialista]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de usuario del especialista
 *     responses:
 *       200:
 *         description: El especialista solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especialista'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: No se encontró el especialista
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
router.get('/especialista/:usuario_id',
  validateUsuarioIdParam,
  EspecialistaController.getEspecialistaById
);

module.exports = router;