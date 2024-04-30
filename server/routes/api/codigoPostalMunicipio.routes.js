const router = require('express').Router();
const CodigoPostalController = require('../../controllers/codigoPostalMunicipio.controller');

// Ruta GET
/**
 * @swagger
 * /codigo-postal/{municipio_id}:
 *   get:
 *     summary: Obtiene un código postal
 *     tags: [Código Postal]
 *     parameters:
 *       - in: path
 *         name: municipio_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El id del municipio
 *     responses:
 *       200:
 *         description: El código postal fue obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: 'array'
 *               items:
 *                 $ref: '#/components/schemas/CodigoPostalItem'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: El código postal no fue encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error al obtener el código postal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *
 */
router.get('/codigo-postal/:municipio_id',
  CodigoPostalController.getCodigoPostal);

module.exports = router;