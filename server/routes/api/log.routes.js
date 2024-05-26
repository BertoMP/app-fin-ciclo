// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de informe
import LogController from '../../controllers/log.controller.js';

// Importación de middlewares para la validación de token y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';
import { verifyUserId } from '../../util/middleware/verifyUserId.js';

// Importación de middlewares para la validación de datos
import { validateQueryParams } from "../../helpers/validators/queryParams/queryParams.validator.js";

// Rutas GET
/**
 * @swagger
 * /log:
 *   get:
 *     summary: Obtiene todos los logs de la base de datos
 *     description: Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los logs. Si ocurre algún error durante el proceso, devuelve un error con el mensaje correspondiente.
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: La página de logs que se desea obtener.
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *         description: La fecha de inicio para filtrar los logs.
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *         description: La fecha de fin para filtrar los logs.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: El número de logs a mostrar por página.
 *     responses:
 *       200:
 *         description: La operación fue exitosa y devuelve los logs correspondientes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogPaginado'
 *       500:
 *         description: Ocurrió un error durante el proceso y se devuelve un mensaje de error.
 */
router.get(
	'/log',
	verifyAccessToken,
	verifyUserRole([1]),
	verifyUserId,
	validateQueryParams,
	LogController.getLogs
);

// Exportación del router de express
export default router;
