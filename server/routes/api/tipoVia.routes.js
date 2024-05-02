// Inicialización del router de expressç
import { Router } from 'express';
const router = Router();

// Importación del controlador de tipo de vía
import TipoViaController from '../../controllers/tipoVia.controller.js';

// Ruta GET
/**
 * @swagger
 * /tipo-via:
 *   get:
 *     summary: Obtiene los tipos de vía
 *     tags: [Tipo vía]
 *     responses:
 *       200:
 *         description: Los tipos de vía fueron obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoVia'
 *       404:
 *         description: Los tipos de vía no fueron encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error al obtener los tipos de vía
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get(
  '/tipo-via',
  TipoViaController.getTipoVia
);

// Exportación del router
export default router;
