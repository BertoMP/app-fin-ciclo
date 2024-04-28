const router = require('express').Router();
const ContactoController = require('../../controllers/contacto.controller');

const {validateContacto} = require("../../helpers/validators/contacto.validator");

// Rutas POST
/**
 * @swagger
 * /contacto:
 *   post:
 *     summary: Envía un mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contacto'
 *     responses:
 *       200:
 *         description: Mensaje de contacto enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       409:
 *          description: Error de validación
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Error al enviar el mensaje de contacto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post('/contacto',
  validateContacto,
  ContactoController.postContacto);

module.exports = router;