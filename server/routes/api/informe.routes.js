// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de informe
import InformeController from '../../controllers/informe.controller.js';

// Importación de middlewares para la validación de token y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';
import { verifyUserId } from '../../util/middleware/verifyUserId.js';

// Importación de middlewares para la validación de datos
import { validateInforme } from '../../helpers/validators/informe.validator.js';
import { validateInformeIdParam } from '../../helpers/validators/params/informeIdParam.validator.js';
import {validateQueryParams} from "../../helpers/validators/queryParams/queryParams.validator.js";
import {validateUsuarioIdParam} from "../../helpers/validators/params/usuarioIdParam.validator.js";

// Rutas GET
/**
 * @swagger
 * /informe/pdf/{informe_id}:
 *   get:
 *     summary: Obtiene el PDF de un informe por su ID
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: informe_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del informe
 *     responses:
 *       200:
 *         description: El PDF del informe solicitado
 *         content:
 *           application/pdf:
 *             schema:
 *               $ref: '#/components/schemas/InformePDF'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenExpiredError'
 *       403:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: No se encontró el informe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get(
	'/informe/pdf/:informe_id',
	verifyAccessToken,
	verifyUserRole([2, 3]),
	verifyUserId,
	validateInformeIdParam,
	InformeController.generaInformePDF,
);

/**
 * @swagger
 * /informe/listado-informe:
 *   get:
 *     summary: Obtiene una lista de informes
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de inicio para filtrar informes
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de fin para filtrar informes
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Límite de informes por página
 *     responses:
 *       200:
 *         description: Lista de informes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InformeList'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenExpiredError'
 *       403:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get(
	'/informe/listado-informes',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validateQueryParams,
	InformeController.getInformes
);

/**
 * @swagger
 * /informe/listado-informes/{usuario_id}:
 *   get:
 *     summary: Obtiene una lista de informes para un usuario específico
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de inicio para filtrar informes
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de fin para filtrar informes
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Límite de informes por página
 *     responses:
 *       200:
 *         description: Lista de informes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InformeList'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenExpiredError'
 *       403:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get(
	'/informe/listado-informes/:usuario_id',
	verifyAccessToken,
	verifyUserRole([3]),
	verifyUserId,
	validateUsuarioIdParam,
	validateQueryParams,
	InformeController.getInformes
);

/**
 * @swagger
 * /informe/{informe_id}:
 *   get:
 *     summary: Obtiene un informe por su ID
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: informe_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del informe
 *     responses:
 *       200:
 *         description: El informe solicitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Informe'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenExpiredError'
 *       403:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       404:
 *         description: No se encontró el informe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.get(
	'/informe/:informe_id',
	verifyAccessToken,
	verifyUserRole([2, 3]),
	verifyUserId,
	validateInformeIdParam,
	InformeController.getInforme,
);

// Rutas POST
/**
 * @swagger
 * /informe:
 *   post:
 *     summary: Crea un nuevo informe
 *     tags: [Informe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InformePost'
 *     responses:
 *       200:
 *         description: Informe creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenExpiredError'
 *       403:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenInvalidError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post(
	'/informe',
	verifyAccessToken,
	verifyUserRole([3]),
	validateInforme,
	InformeController.createInforme,
);

// Exportación del router
export default router;
