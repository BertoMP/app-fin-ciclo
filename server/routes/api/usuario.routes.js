// Inicialización del router de express
import { Router } from 'express';
const router = Router();

// Importación del controlador de usuario
import UsuarioController from '../../controllers/usuario.controller.js';

// Importación de middlewares para la validación de token y roles
import { verifyAccessToken } from '../../helpers/jwt/verifyAccessToken.js';
import { verifyUserRole } from '../../util/middleware/verifyUserRole.js';
import { verifyUserId } from '../../util/middleware/verifyUserId.js';

// Importación de middlewares para la validación de datos
import { validateUserLogin } from '../../helpers/validators/usuarioLogin.validator.js';
import { validatePacienteRegister } from '../../helpers/validators/pacienteRegistro.validador.js';
import { validateEspecialistaRegister } from '../../helpers/validators/especialistaRegistro.validator.js';
import { validateUserPasswordChange } from '../../helpers/validators/usuarioPasswordChange.validator.js';
import { validateRoleQueryParams } from '../../helpers/validators/queryParams/roleQueryParams.validator.js';
import { validateUsuarioIdParam } from '../../helpers/validators/params/usuarioIdParam.validator.js';
import { validatePacienteUpdate } from '../../helpers/validators/pacienteUpdate.validator.js';
import { validateEspecialistaUpdate } from '../../helpers/validators/especialistaUpdate.validator.js';

// Rutas GET
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene una lista de todos los usuarios
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           description: La página a devolver
 *         - in: query
 *           name: role
 *           schema:
 *             type: integer
 *           description: El rol por el que filtrar
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsuarioPaginado'
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
 *         description: Pagina de usuario no encontrada
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
	'/usuario/listado',
	verifyAccessToken,
	verifyUserRole([1]),
	validateRoleQueryParams,
	UsuarioController.getListado,
);

/**
 * @swagger
 * /usuario/{usuario_id}:
 *   get:
 *     summary: Obtiene la información de un usuario específico
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
	'/usuario/:usuario_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateUsuarioIdParam,
	UsuarioController.getUsuario,
);

/**
 * @swagger
 * /usuario/{usuario_id}:
 *   get:
 *     summary: Obtiene la información de un usuario específico
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
	'/usuario',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	UsuarioController.getUsuario,
);

// Rutas POST
/**
 * @swagger
 * /usuario/registro:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioPaciente'
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
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
 *       409:
 *         description: El correo o DNI ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post(
	'/usuario/registro',
	validatePacienteRegister,
	UsuarioController.postRegistro
);

/**
 * @swagger
 * /usuario/paciente:
 *   put:
 *     summary: Actualiza la información del paciente
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioPaciente'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *       409:
 *         description: El correo ya está en uso o El DNI ya está en uso o El número de colegiado ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post(
	'/usuario/registro-especialista',
	verifyAccessToken,
	verifyUserRole([1]),
	validateEspecialistaRegister,
	UsuarioController.postRegistroEspecialista,
);

/**
 * @swagger
 * /usuario/login:
 *   post:
 *     summary: Inicio de sesión del usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       403:
 *         description: Correo o contraseña incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncorrectPassOrUserError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post(
	'/usuario/login',
	validateUserLogin,
	UsuarioController.postLogin
);

/**
 * @swagger
 * /usuario/contrasena-olvidada:
 *   post:
 *     summary: Solicita un cambio de contraseña para un usuario
 *     description: Envía un correo electrónico al usuario con un enlace para cambiar su contraseña
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *     responses:
 *       200:
 *         description: Se envió el correo electrónico con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       404:
 *         description: Correo no encontrado en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerError'
 */
router.post(
	'/usuario/contrasena-olvidada',
	UsuarioController.postForgotPassword
);

/**
 * @swagger
 * /usuario/contrasena-reset:
 *   post:
 *     summary: Restablece la contraseña de un usuario
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: El token de restablecimiento de contraseña
 *               password:
 *                 type: string
 *                 description: La nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       403:
 *         description: Token inválido o expirado
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
	'/usuario/contrasena-reset',
	validateUserPasswordChange,
	UsuarioController.postResetPassword,
);

/**
 * @swagger
 * /usuario/refresh-token:
 *   post:
 *     summary: Actualiza el token de acceso del usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: El token de actualización del usuario
 *     responses:
 *       200:
 *         description: El token de acceso se actualizó con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito
 *                 access_token:
 *                   type: string
 *                   description: El nuevo token de acceso
 *                 refresh_token:
 *                   type: string
 *                   description: El nuevo token de actualización
 *       403:
 *         description: Token de actualización inválido
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
router.post('/usuario/refresh-token', UsuarioController.postRefreshToken);

/**
 * @swagger
 * /usuario/logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cierre de sesión correcto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
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
router.post('/usuario/logout', verifyAccessToken, verifyUserId, UsuarioController.postLogout);

// Rutas PUT
/**
 * @swagger
 * /usuario/update-password:
 *   post:
 *     summary: Actualizar la contraseña de un usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: La nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: La contraseña se actualizó correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
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
router.put(
	'/usuario/actualizar-password',
	verifyAccessToken,
	verifyUserId,
	validateUserPasswordChange,
	UsuarioController.postUpdatePassword,
);

/**
 * @swagger
 * /usuario/actualizar-usuario/{usuario_id}:
 *   put:
 *     summary: Actualiza la información de un paciente por un admin
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario a actualizar
 *       - in: body
 *         name: usuario
 *         description: Información del usuario a actualizar
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - nombre
 *             - primer_apellido
 *             - segundo_apellido
 *             - dni
 *           properties:
 *             email:
 *               type: string
 *               description: Correo electrónico del usuario
 *             nombre:
 *               type: string
 *               description: Nombre del usuario
 *             primer_apellido:
 *               type: string
 *               description: Primer apellido del usuario
 *             segundo_apellido:
 *               type: string
 *               description: Segundo apellido del usuario
 *             dni:
 *               type: string
 *               description: DNI del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
router.put(
	'/usuario/actualizar-usuario/:usuario_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateUsuarioIdParam,
	validatePacienteUpdate,
	UsuarioController.putUsuarioPaciente,
);

/**
 * @swagger
 * /usuario/actualizar-usuario:
 *   put:
 *     summary: Actualiza la información de un paciente
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: La información del usuario se ha actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
router.put(
	'/usuario/actualizar-usuario',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	validatePacienteUpdate,
	UsuarioController.putUsuarioPaciente,
);

/**
 * @swagger
 * /usuario/actualizar-especialista/{usuario_id}:
 *   put:
 *     summary: Actualiza la información de un especialista
 *     security:
 *       - bearerAuth: []
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del especialista
 *       - in: body
 *         name: usuario
 *         description: Información del especialista para actualizar
 *         schema:
 *           $ref: '#/components/schemas/UsuarioEspecialista'
 *     responses:
 *       200:
 *         description: Información del especialista actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioEspecialista'
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
router.put(
	'/usuario/actualizar-especialista/:usuario_id',
	verifyAccessToken,
	verifyUserRole([1]),
	validateUsuarioIdParam,
	validateEspecialistaUpdate,
	UsuarioController.putUsuarioEspecialista,
);

// Rutas DELETE
/**
 * @swagger
 * /usuario/borrar-usuario:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
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
router.delete(
	'/usuario/borrar-usuario',
	verifyAccessToken,
	verifyUserRole([2]),
	verifyUserId,
	UsuarioController.deleteUsuario,
);

// Exportación del router
export default router;
