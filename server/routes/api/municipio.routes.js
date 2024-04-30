const router = require('express').Router();
const MunicipioController = require('../../controllers/municipio.controller');
const {validateProvinciaIdParam} = require('../../helpers/validators/params/provinciaIdParam.validator');

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

module.exports = router;