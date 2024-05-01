// Inicialización del router de express
const router                        = require('express').Router();

// Importación del controlador de municipio
const MunicipioController           = require('../../controllers/municipio.controller');

// Importación de middlewares para la validación de datos
const validateProvinciaIdParam  = require('../../helpers/validators/params/provinciaIdParam.validator');

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
router.get('/municipio/:provincia_id',
  validateProvinciaIdParam,
  MunicipioController.getMunicipio);

// Exportación del router
module.exports = router;