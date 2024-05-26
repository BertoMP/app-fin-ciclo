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
router.get(
	'/log',
	verifyAccessToken,
	verifyUserRole([1]),
	validateQueryParams,
	LogController.getLogs
);

// Exportación del router de express
export default router;
