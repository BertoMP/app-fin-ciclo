// Inicialización del router de express
const router              = require('express').Router();

// Importación del controlador de contacto
const ContactoController  = require('../../controllers/contacto.controller');

// Importación de middlewares para la validación de datos
const validateContacto    = require("../../helpers/validators/contacto.validator");

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
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
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

// Exportación del router
module.exports = router;