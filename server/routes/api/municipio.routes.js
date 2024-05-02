// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de municipio
import MunicipioController from '../../controllers/municipio.controller.js';

// Importación de middlewares para la validación de datos
import { validateProvinciaIdParam } from '../../helpers/validators/params/provinciaIdParam.validator.js';

// Ruta GET
/**
 * @swagger
 * /municipio/{provincia_id}:
 *   get:
 *     summary: Obtiene un municipio
 *     tags: [Municipio]
 *     parameters:
 *       - in: path
 *         name: provincia_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El id de la provincia
 *     responses:
 *       200:
 *         description: El municipio fue obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Municipio'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: El municipio no fue encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error al obtener el municipio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *
 */
router.get('/municipio/:provincia_id', validateProvinciaIdParam, MunicipioController.getMunicipio);

// Exportación del router
export default router;
