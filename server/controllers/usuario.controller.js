// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

// Importación de los servicios necesarios
import UsuarioService from '../services/usuario.service.js';
import EspecialistaService from '../services/especialista.service.js';
import TokenService from '../services/token.service.js';

// Importación de los helpers necesarios
import { verifyResetToken } from '../helpers/jwt/verifyResetToken.js';

// Importación de las funciones necesarias
import {getSearchValues} from "../util/functions/getSearchValues.js";

/**
 * @class UsuarioController
 * @description Clase estática que implementa la lógica de los usuarios de la aplicación.
 */
class UsuarioController {
	/**
	 * @name getUsuario
	 * @description Método asíncrono que obtiene un usuario de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del usuario.
	 *              Si el usuario no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async getUsuario(req, res) {
		let id = 0;

		if (req.user_role === 2) {
			id = req.user_id;
		} else if (req.user_role === 1) {
			id = req.params.usuario_id;
		}

		id = parseInt(id);

		try {
			const userData = await UsuarioService.readUsuarioById(id);

			return res.status(200).json(userData);
		} catch (err) {
			if (err.message === 'El usuario no existe.') {
				return res.status(404).json({ errors: [err.message] });
			}

			if (err.message === 'Especialista no encontrado.') {
				return res.status(404).json({ errors: [err.message] });
			}

			if (err.message === 'El usuario es un admin.') {
				return res.status(409).json({ errors: [err.message] });
			}

			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name getListado
	 * @description Método asíncrono que obtiene una lista de usuarios de la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los usuarios y la información de paginación.
	 *              Si la página solicitada no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async getListado(req, res) {
		try {
			const searchValues = getSearchValues(req, 'role');
			const usuarios = await UsuarioService.readAllUsuarios(searchValues);

			return res.status(200).json({
				prev: usuarios.prev,
				next: usuarios.next,
				pagina_actual: usuarios.pagina_actual,
				paginas_totales: usuarios.paginas_totales,
				cantidad_usuarios: usuarios.cantidad_usuarios,
				result_min: usuarios.result_min,
				result_max: usuarios.result_max,
				items_pagina: usuarios.items_pagina,
				resultados: usuarios.resultados,
			});
		} catch (err) {
			if (err.message === 'La página solicitada no existe.') {
				return res.status(404).json({ errors: [err.message] });
			}

			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name postRegistro
	 * @description Método asíncrono que registra un nuevo usuario en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el correo electrónico o el DNI ya están en uso, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async postRegistro(req, res) {
		const errors = [];
		try {
			await UsuarioService.createUsuario(req.body);

			return res.status(200).json({ message: 'Usuario creado exitosamente.' });
		} catch (err) {
			if (err.message === 'El correo electrónico ya está en uso.') {
				errors.push(err.message);
			}

			if (err.message === 'El DNI ya está en uso.') {
				errors.push(err.message);
			}

			if (err.message === 'El número de colegiado ya está en uso.') {
				errors.push(err.message);
			}

			if (errors.length > 0) {
				return res.status(409).json({ errors });
			}

			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name postLogin
	 * @description Método asíncrono que maneja el inicio de sesión de un usuario.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito y los tokens de acceso y actualización.
	 *              Si el correo electrónico o la contraseña son incorrectos, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async postLogin(req, res) {
		const email = req.body.email;
		const password = req.body.password;

		try {
			const { accessToken, refreshToken } = await UsuarioService.userLogin(email, password);
			return res.status(200).json({
				message: 'Inicio de sesión exitoso.',
				access_token: accessToken,
				refresh_token: refreshToken,
			});
		} catch (err) {
			if (err.message === 'Correo o contraseña incorrectos.') {
				return res.status(403).json({ errors: [err.message] });
			}

			if (err.message === 'Cuenta deshabilitada.') {
				return res.status(403).json({ errors: [err.message] });
			}

			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name postForgotPassword
	 * @description Método asíncrono que maneja la solicitud de restablecimiento de contraseña de un usuario.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el correo electrónico no se encuentra en la base de datos, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async postForgotPassword(req, res) {
		const email = req.body.email;

		try {
			await UsuarioService.forgotPassword(email);

			return res.status(200).json({
				message: 'Correo enviado exitosamente.',
			});
		} catch (err) {
			if (err.message === 'Correo no encontrado.') {
				return res.status(404).json({ errors: [err.message] });
			}

			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name patchResetPassword
	 * @description Método asíncrono que maneja el restablecimiento de la contraseña de un usuario.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el token es inválido o ha expirado, o si el usuario no se encuentra, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async patchResetPassword(req, res) {
		const newPassword = req.body.password;
		const userEmail = await verifyResetToken(req, res);

		try {
			await UsuarioService.resetPassword(userEmail, newPassword);

			return res.status(200).json({
				message: 'Contraseña actualizada exitosamente.',
			});
		} catch (err) {
			if (err.message === 'Correo no encontrado.') {
				return res.status(404).json({ errors: [err.message] });
			}
			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name patchUpdatePassword
	 * @description Método asíncrono que actualiza la contraseña de un usuario en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el correo electrónico no se encuentra en la base de datos, o si el usuario no tiene permiso para realizar la acción,
	 *              devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async patchUpdatePassword(req, res) {
		const id = req.user_id;

		try {
			await UsuarioService.updatePassword(id, req.body);

			return res.status(200).json({
				message: 'Contraseña actualizada exitosamente.',
			});
		} catch (err) {
			if (err.message === 'Usuario no encontrado.') {
				return res.status(404).json({ errors: [err.message] });
			}

			if (err.message === 'La contraseña actual no es correcta') {
				return res.status(403).json({ errors: [err.message] });
			}

			if (err.message === 'La contraseña nueva no puede ser igual a la actual.') {
				return res.status(409).json({ errors: [err.message] });
			}

			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name deleteUsuario
	 * @description Método asíncrono que elimina un usuario de la base de datos utilizando su ID.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el usuario no existe, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async deleteUsuario(req, res) {
		let id = 0;

		if (req.user_role === 1) {
			id = req.params.usuario_id;
		} else if (req.user_role === 2) {
			id = req.user_id;
		}

		id = parseInt(id);

		try {
			await UsuarioService.deleteUsuario(id);

			return res.status(200).json({
				message: 'Usuario eliminado exitosamente.',
			});

		} catch (err) {
			return res.status(500).json({
				errors: [err.message],
			});
		}
	}

	/**
	 * @name patchRefreshToken
	 * @description Método asíncrono que maneja la renovación del token de acceso de un usuario.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito y los nuevos tokens de acceso y actualización.
	 *              Si el token de actualización no se proporciona, es inválido, o el usuario no se encuentra, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 403 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async patchRefreshToken(req, res) {
		const refreshToken = req.body.refresh_token;

		try {
			const { new_access_token, new_refresh_token }
				= await UsuarioService.updateRefreshToken(refreshToken);

			return res.status(200).json({
				message: 'Token de acceso renovado exitosamente.',
				access_token: new_access_token,
				refresh_token: new_refresh_token,
			});
		} catch (err) {
			if (err.message === 'El token no es valido.') {
				return res.status(403).json({
					errors: ['Token de actualización inválido.'],
				});
			}

			if (err.message === 'No se ha proporcionado un token de actualización.') {
				return res.status(403).json({
					errors: ['Token de actualización no proporcionado.'],
				});
			}

			if (err.message === 'El usuario no existe.') {
				return res.status(404).json({
					errors: ['Usuario no encontrado.'],
				});
			}

			return res.status(403).json({
				errors: ['Token de actualización inválido.'],
			});
		}
	}

	/**
	 * @name patchLogout
	 * @description Método asíncrono que maneja el cierre de sesión de un usuario.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async patchLogout(req, res) {
		const userId = req.user_id;

		try {
			await UsuarioService.userLogout(userId);

			return res.status(200).json({ message: 'Cierre de sesión correcto.' });
		} catch (err) {
			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name putUsuario
	 * @description Método asíncrono que actualiza los datos de un usuario en la base de datos.
	 * 						Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 * 						Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async putUsuario(req, res) {
		const errors = [];
		let usuario_id = 0;
		let isAdmin = false;

		if (req.user_role === 2) {
			usuario_id = req.user_id;
		} else if (req.user_role === 1) {
			usuario_id = req.params.usuario_id;
			isAdmin = true;
		}

		usuario_id = parseInt(usuario_id);

		try {
			await UsuarioService.updateUsuario(usuario_id, isAdmin, req.body);

			return res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
		} catch (err) {
			if (err.message === 'La contraseña actual no es correcta') {
				return res.status(403).json({ errors: [err.message] });
			}

			if (err.message === 'El usuario no existe.') {
				return res.status(404).json({ errors: [err.message] });
			}

			if (err.message === 'El usuario es un admin.') {
				return res.status(409).json({ errors: [err.message] });
			}

			if (err.message === 'El correo electrónico ya está en uso.') {
				errors.push(err.message);
			}

			if (err.message === 'El DNI ya está en uso.') {
				errors.push(err.message);
			}

			if (err.message === 'El número de colegiado ya está en uso.') {
				errors.push(err.message);
			}

			if (errors.length > 0) {
				return res.status(409).json({ errors });
			}


			return res.status(500).json({ errors: [err.message] });
		}
	}
}

// Exportación del controlador
export default UsuarioController;
