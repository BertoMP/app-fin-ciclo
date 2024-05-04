// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

// Importación de los servicios necesarios
import UsuarioService from '../services/usuario.service.js';
import EspecialistaService from '../services/especialista.service.js';
import TokenService from '../services/token.service.js';
import EmailService from '../services/email.service.js';

// Importación de las librerías necesarias
import pkg from 'bcryptjs';
const { compare } = pkg;

// Importación de los helpers necesarios
import { createEncryptedPassword } from '../util/functions/createEncryptedPassword.js';
import { verifyResetToken } from '../helpers/jwt/verifyResetToken.js';

// Importación de las funciones necesarias
import PacienteService from "../services/paciente.service.js";
import CitaService from "../services/cita.service.js";
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

		try {
			let usuario = await UsuarioService.getRoleByUserId(id);
			let userData = {};

			if (!usuario) {
				return res.status(404).json({
					errors: ['Usuario no encontrado.'],
				});
			}

			const usuarioRole = usuario.rol_id;

			if (usuarioRole === 1) {
				return res.status(409).json({
					errors: ['No se puede obtener a un admin.']
				});
			} else if (usuarioRole === 2) {
				userData = await PacienteService.readPacienteByUserId(id);
			} else {
				userData = await EspecialistaService.readEspecialistaByUserId(id);
			}

			return res.status(200).json(userData);
		} catch (err) {
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
			const page = searchValues.page;
			const role_id = searchValues.role;
			const search = searchValues.search;
			const limit = searchValues.limit;
			const {
				formattedRows: resultados,
				actualPage: pagina_actual,
				total: cantidad_usuarios,
				totalPages: paginas_totales,
			} = await UsuarioService.readAllUsuarios(searchValues);

			if (page > 1 && page > paginas_totales) {
				return res.status(404).json({
					errors: ['La página de usuarios solicitada no existe.'],
				});
			}

			let queryParams = '';

			if (role_id) {
				queryParams += `&role=${role_id}`;
			}
			if (search) {
				queryParams += `&search=${search}`;
			}

			const prev =
				page > 1
					? `/usuario/listado?page=${page - 1}&limit=${limit}${queryParams}`
					: null;
			const next =
				page < paginas_totales
					? `/usuario/listado?page=${page + 1}&limit=${limit}${queryParams}`
					: null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const items_pagina = parseInt(limit);

			const users = {
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_usuarios,
				items_pagina,
				result_min,
				result_max,
				resultados,
			};

			return res.status(200).json(users);
		} catch (err) {
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
		try {
			const errors = UsuarioController.#verifyUser(req.body.email, req.body.dni, req.body.num_colegiado);

			if (errors.length > 0) {
				return res.status(409).json({ errors: errors });
			}

			await UsuarioService.createUsuario(req.body);

			return res.status(200).json({ message: 'Usuario creado exitosamente.' });
		} catch (err) {
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
			const user = await UsuarioService.readUsuarioByEmail(email);

			if (!user) {
				return res.status(403).json({
					errors: ['Correo o contraseña incorrectos.'],
				});
			}

			const validPassword = await compare(password, user.datos_personales.password);

			if (!validPassword) {
				return res.status(403).json({
					errors: ['Correo o contraseña incorrectos.'],
				});
			}

			const accessToken = TokenService.createAccessToken(user);
			const refreshToken = TokenService.createRefreshToken(user);

			await UsuarioService.updateRefreshToken(user.usuario_id, refreshToken);

			return res.status(200).json({
				message: 'Inicio de sesión exitoso.',
				access_token: accessToken,
				refresh_token: refreshToken,
			});
		} catch (err) {
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
			const user = await UsuarioService.readUsuarioByEmail(email);
			if (!user) {
				return res.status(404).json({
					errors: ['Correo no encontrado en la base de datos.'],
				});
			}


			const idUser = user.usuario_id;
			const resetToken = TokenService.createResetToken(user);

			await TokenService.createToken(idUser, resetToken);
			await EmailService.sendPasswordResetEmail(email, user, resetToken);

			return res.status(200).json({
				message: 'Correo enviado exitosamente.',
			});
		} catch (err) {
			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name postResetPassword
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
	static async postResetPassword(req, res) {
		const newPassword = req.body.password;
		const userEmail = await verifyResetToken(req, res);

		try {
			const user = await UsuarioService.readUsuarioByEmail(userEmail);

			if (!user) {
				return res.status(404).json({
					errors: ['Usuario no encontrado.'],
				});
			}

			const encryptedPassword = await createEncryptedPassword(newPassword);
			await UsuarioService.updatePassword(user.datos_personales.email, encryptedPassword);

			return res.status(200).json({
				message: 'Contraseña actualizada exitosamente.',
			});
		} catch (err) {
			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name postUpdatePassword
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
	static async postUpdatePassword(req, res) {
		const email = req.body.email;
		const password = req.body.password;
		const id = req.user_id;

		try {
			const user = await UsuarioService.readUsuarioByEmail(email);

			if (!user) {
				return res.status(404).json({
					errors: ['Correo no encontrado.'],
				});
			}

			if (user.usuario_id !== id) {
				return res.status(403).json({
					errors: ['No tienes permiso para realizar esta acción.'],
				});
			}

			await UsuarioService.updatePassword(email, password);

			return res.status(200).json({
				message: 'Contraseña actualizada exitosamente.',
			});
		} catch (err) {
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

		try {
			const userExists = await UsuarioService.readUsuarioById(id);

			if (!userExists) {
				return res.status(404).json({
					errors: ['Usuario no encontrado.'],
				});
			}

			const userRole = userExists.datos_rol.rol_id;

			switch (userRole) {
				case 1:
					return res.status(409).json({
						errors: ['No se puede eliminar a un admin'],
					});
				case 2:
					await PacienteService.deletePaciente(id);
					break;
				case 3:
					const especialistaCita = await CitaService.readCitasByEspecialistaId(id);

					if (especialistaCita.length > 0) {
						await EspecialistaService.setNoTrabajando(id);
					} else {
						await EspecialistaService.deleteEspecialista(id);
					}
					break;
			}

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
	 * @name postRefreshToken
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
	static async postRefreshToken(req, res) {
		const refreshToken = req.body.refresh_token;

		if (!refreshToken) {
			return res.status(403).json({
				errors: ['No se proporcionó el token de actualización.'],
			});
		}

		try {
			const decodedToken = TokenService.verifyRefreshToken(refreshToken);

			const user = await UsuarioService.readUsuarioById(decodedToken.user_id);
			if (!user) {
				return res.status(404).json({
					errors: ['Usuario no encontrado.'],
				});
			}

			if (user.refresh_token !== refreshToken) {
				return res.status(403).json({
					errors: ['Token de actualización inválido.'],
				});
			}

			const newAccessToken = TokenService.createAccessToken(user);
			const newRefreshToken = TokenService.createRefreshToken(user);

			await UsuarioService.updateRefreshToken(user.id, newRefreshToken);

			return res.status(200).json({
				message: 'Token de acceso renovado exitosamente.',
				access_token: newAccessToken,
				refresh_token: newRefreshToken,
			});
		} catch (err) {
			return res.status(403).json({
				errors: ['Token de actualización inválido.'],
			});
		}
	}

	/**
	 * @name postLogout
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
	static async postLogout(req, res) {
		const userId = req.user_id;

		try {
			await UsuarioService.updateRefreshToken(userId, null);

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
		let usuario_id = 0;

		if (req.user_role === 2) {
			usuario_id = req.user_id;
		} else if (req.user_role === 1) {
			usuario_id = req.params.usuario_id;
		}

		try {
			const user = await UsuarioService.readUsuarioById(usuario_id);

			if (!user) {
				return res.status(404).json({ errors: ['Usuario no encontrado.'] });
			}

			if (user.rol_id === 1) {
				return res.status(409).json({ errors: ['No se puede modificar a un admin.'] });
			}

			const errors = UsuarioController.#verifyUser(
				req.body.datos_personales.email, req.body.datos_personales.dni, req.body.datos_personales.num_colegiado);

			if (errors.length > 0) {
				return res.status(409).json({ errors: errors });
			}

			await UsuarioService.updateUsuario(req.body);

			return res.status(200).json({ message: 'Usuario actualizado exitosamente.' });

		} catch (err) {
			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name verifyUser
	 * @description Método estático privado que verifica si un usuario ya existe en la base de datos.
	 * @private
	 * @static
	 * @async
	 * @function
	 * @param {string} email - El correo electrónico del usuario.
	 * @param {string} dni - El DNI del usuario.
	 * @param {string} num_colegiado - El número de colegiado del especialista.
	 * @returns {Array} - Un array con los errores encontrados.
	 * @memberof UsuarioController
	 */
	static async #verifyUser(email, dni, num_colegiado) {
		const errors = [];

		const emailExists = await UsuarioService.readUsuarioByEmail(email);
		const dniExists = await UsuarioService.readUsuarioByDNI(dni);

		if (num_colegiado) {
			const numColegiadoExists = await EspecialistaService.readEspecialistaByNumColegiado(num_colegiado);

			if (numColegiadoExists) {
				errors.push('El número de colegiado ya está en uso.');
			}
		}

		if (emailExists) {
			errors.push('El correo ya está en uso.');
		}

		if (dniExists) {
			errors.push('El DNI ya está en uso.');
		}

		return errors;
	}
}

// Exportación del controlador
export default UsuarioController;
