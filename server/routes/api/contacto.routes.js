// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de contacto
import ContactoController from '../../controllers/contacto.controller.js';

// Importación de middlewares para la validación de datos
import { validateContacto } from '../../helpers/validators/contacto.validator.js';

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
router.post(
  '/contacto',
  validateContacto,
  ContactoController.postContacto
);

// Exportación del router
export default router;
