// Importación de los servicios necesarios
import UsuarioService from '../services/usuario.service.js';
import EspecialistaService from '../services/especialista.service.js';
import TokenService from '../services/token.service.js';
import EmailService from '../services/email.service.js';

// Importación de las librerías necesarias
import pkg from 'bcryptjs';
const { compare } = pkg;

import pkg2 from 'jsonwebtoken';
const { verify } = pkg2;

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

// Importación de los helpers necesarios
import { createAccessToken } from '../helpers/jwt/createAccessToken.js';
import { createResetToken } from '../helpers/jwt/createResetToken.js';
import { createRefreshToken } from '../helpers/jwt/createRefreshToken.js';
import { createEncryptedPassword } from '../util/functions/createEncryptedPassword.js';
import { createUserObject } from '../util/functions/createUserObject.js';
import { createHistClinica } from '../util/functions/createHistClinica.js';
import { verifyResetToken } from '../helpers/jwt/verifyResetToken.js';

// Importación de las funciones necesarias
import { getSearchValuesByRole } from '../util/functions/getSearchValuesByRole.js';
import PacienteService from "../services/paciente.service.js";
import CitaService from "../services/cita.service.js";

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
		let role_id = 0;

		if (req.user_role === 2) {
			id = req.user_id;
			role_id = 2;
		} else if (req.user_role === 1) {
			id = req.params.usuario_id;
		}

		try {
			if (!role_id) {
				role_id = await UsuarioService.readUsuarioRoleById(id);

				if (!role_id) {
					return res.status(404).json({
						errors: ['Usuario no encontrado.'],
					});
				}
			}

			if (role_id === 2) {
				const user = await UsuarioService.readUsuarioPaciente(id);

				if (!user) {
					return res.status(404).json({
						errors: ['Usuario no encontrado.'],
					});
				}

				return res.status(200).json(user);
			}

			const user = await UsuarioService.readUsuarioEspecialista(id);

			if (!user) {
				return res.status(404).json({
					errors: ['Usuario no encontrado.'],
				});
			}

			return res.status(200).json(user);
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
		const limit = 10;

		try {
			const searchValues = getSearchValuesByRole(req);

			const page = searchValues.page;
			const role_id = searchValues.role;

			const {
				rows: resultados,
				actualPage: pagina_actual,
				total: cantidad_usuarios,
				totalPages: paginas_totales,
			} = await UsuarioService.readAllUsuarios(searchValues, limit);

			if (page > 1 && page > paginas_totales) {
				return res.status(404).json({
					errors: ['La página de usuarios solicitada no existe.'],
				});
			}

			const prev =
				page > 1
					? role_id
						? `/usuario/listado?page=${page - 1}&role=${role_id}`
						: `/usuario/listado?page=${page - 1}`
					: null;
			const next =
				page < paginas_totales
					? role_id
						? `/usuario/listado?page=${page + 1}&role=${role_id}`
						: `/usuario/listado?page=${page + 1}`
					: null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const items_pagina = limit;

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
			const errors = [];

			const emailExists = await UsuarioService.readUsuarioByEmail(req.body.email);

			if (emailExists) {
				errors.push('El correo ya está en uso.');
			}

			const dniExists = await UsuarioService.readUsuarioByDNI(req.body.dni);

			if (dniExists) {
				errors.push('El DNI ya está en uso.');
			}

			if (errors.length > 0) {
				return res.status(409).json({ errors: errors });
			}

			const encryptedPassword = await createEncryptedPassword(req.body.password);
			const user = createUserObject(req, encryptedPassword, 2);

			const patient = {
				num_hist_clinica: createHistClinica(),
				fecha_nacimiento: req.body.fecha_nacimiento,
				tipo_via: req.body.tipo_via,
				nombre_via: req.body.nombre_via,
				numero: req.body.numero,
				piso: req.body.piso,
				puerta: req.body.puerta,
				municipio: req.body.municipio,
				codigo_postal: req.body.codigo_postal,
				tel_fijo: req.body.tel_fijo,
				tel_movil: req.body.tel_movil,
			};

			await UsuarioService.createUsuarioPaciente(user, patient);

			await EmailService.sendWelcomeEmail(req.body.email, req.body.nombre);

			return res.status(200).json({ message: 'Usuario creado exitosamente.' });
		} catch (err) {
			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name postRegistroEspecialista
	 * @description Método asíncrono que registra un nuevo especialista en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el correo electrónico ya está en uso, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async postRegistroEspecialista(req, res) {
		try {
			const userExists = await UsuarioService.readUsuarioByEmail(req.body.email);

			if (userExists) {
				return res.status(409).json({
					errors: ['El correo ya está en uso.'],
				});
			}

			const encryptedPassword = await createEncryptedPassword(req.body.password);
			const user = createUserObject(req, encryptedPassword, 3);

			let descripcion = req.body.descripcion;
			descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

			const specialist = {
				num_colegiado: req.body.num_colegiado,
				descripcion: descripcion,
				imagen: req.body.imagen,
				turno: req.body.turno,
				especialidad_id: req.body.especialidad_id,
				consulta_id: req.body.consulta_id,
			};

			await UsuarioService.createUsuarioEspecialista(user, specialist);

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

			const validPassword = await compare(password, user.password);

			if (!validPassword) {
				return res.status(403).json({
					errors: ['Correo o contraseña incorrectos.'],
				});
			}

			const accessToken = createAccessToken(user);
			const refreshToken = createRefreshToken(user);

			await UsuarioService.updateRefreshToken(user.id, refreshToken);

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

			const idUser = user.id;
			const resetToken = createResetToken(user);

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
			await UsuarioService.updatePassword(user.email, encryptedPassword);

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

			if (user.id !== id) {
				return res.status(403).json({
					errors: ['No tienes permiso para realizar esta acción.'],
				});
			}

			const encryptedPassword = await createEncryptedPassword(password);

			await UsuarioService.updatePassword(email, encryptedPassword);

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

			if (userExists.rol_id === 1) {
				return res.status(409).json({
					errors: ['No se puede eliminar a un admin'],
				});
			}

			if (userExists.rol_id === 2) {
				await PacienteService.deletePaciente(id);

				return res.status(200).json({
					message: 'Paciente eliminado exitosamente.',
				});
			} else if (userExists.rol_id === 3) {
				const especialistaCita = await CitaService.readCitasByEspecialistaId(id);

				if (especialistaCita.length > 0) {
					await EspecialistaService.setNoTrabajando(id);

					return res.status(200).json({
						message: 'El especialista no se pudo eliminar. Se cambió su turno.'
					});
				}

				await EspecialistaService.deleteEspecialista(id);

				return res.status(200).json({
					message: 'Especialista eliminado exitosamente.',
				});
			}
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
			const decodedToken = verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

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

			const newAccessToken = createAccessToken(user);
			const newRefreshToken = createRefreshToken(user);

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
	 * @name putUsuarioPaciente
	 * @description Método asíncrono que actualiza los datos de un usuario paciente en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el DNI ya está en uso por otro usuario, devuelve un error con el mensaje correspondiente.
	 *              Si el usuario no existe o no tiene permiso para realizar la acción, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async putUsuarioPaciente(req, res) {
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

			const dniExits = await UsuarioService.readUsuarioByDNI(req.body.dni);

			if (dniExits && user.dni !== req.body.dni) {
				return res.status(409).json({
					errors: ['El DNI ya está en uso.'],
				});
			}

			const emailExists = await UsuarioService.readUsuarioByEmail(req.body.email);

			if (emailExists && user.email !== req.body.email) {
				return res.status(409).json({
					errors: ['El correo ya está en uso.'],
				});
			}

			const userUpdate = {
				email: req.body.email,
				nombre: req.body.nombre,
				primer_apellido: req.body.primer_apellido,
				segundo_apellido: req.body.segundo_apellido,
				dni: req.body.dni,
			};

			const patientUpdate = {
				fecha_nacimiento: req.body.fecha_nacimiento,
				tipo_via: req.body.tipo_via,
				nombre_via: req.body.nombre_via,
				numero: req.body.numero,
				piso: req.body.piso,
				puerta: req.body.puerta,
				municipio: req.body.municipio,
				codigo_postal: req.body.codigo_postal,
				tel_fijo: req.body.tel_fijo,
				tel_movil: req.body.tel_movil,
			};

			await UsuarioService.updateUsuarioPaciente(userUpdate, patientUpdate);

			return res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
		} catch (err) {
			return res.status(500).json({ errors: [err.message] });
		}
	}

	/**
	 * @name putUsuarioEspecialista
	 * @description Método asíncrono que actualiza los datos de un usuario especialista en la base de datos.
	 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
	 *              Si el usuario no existe o no tiene permiso para realizar la acción, devuelve un error con el mensaje correspondiente.
	 * @static
	 * @async
	 * @function
	 * @param {Object} req - El objeto de solicitud de Express.
	 * @param {Object} res - El objeto de respuesta de Express.
	 * @returns {Object} res - El objeto de respuesta de Express.
	 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
	 * @memberof UsuarioController
	 */
	static async putUsuarioEspecialista(req, res) {
		const id = req.params.usuario_id;

		try {
			const user = await UsuarioService.readUsuarioById(id);

			if (!user) {
				return res.status(404).json({ errors: ['Usuario no encontrado.'] });
			}

			const dniExits = await UsuarioService.readUsuarioByDNI(req.body.dni);

			if (dniExits && user.dni !== req.body.dni) {
				return res.status(409).json({
					errors: ['El DNI ya está en uso.'],
				});
			}

			const numColegiadoExists = await EspecialistaService.readEspecialistaByNumColegiado(
				req.body.num_colegiado,
			);

			if (numColegiadoExists && user.num_colegiado !== req.body.num_colegiado) {
				return res.status(409).json({
					errors: ['El número de colegiado ya está en uso.'],
				});
			}

			const emailExists = await UsuarioService.readUsuarioByEmail(req.body.email);

			if (emailExists && user.email !== req.body.email) {
				return res.status(409).json({
					errors: ['El correo ya está en uso.'],
				});
			}

			const specialist = {
				email: req.body.email,
				nombre: req.body.nombre,
				primer_apellido: req.body.primer_apellido,
				segundo_apellido: req.body.segundo_apellido,
				dni: req.body.dni,
				num_colegiado: req.body.num_colegiado,
				descripcion: req.body.descripcion,
				turno: req.body.turno,
				especialidad_id: req.body.especialidad_id,
				consulta_id: req.body.consulta_id,
				imagen: req.body.imagen,
			};

			await UsuarioService.updateUsuarioEspecialista(user, specialist);

			return res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
		} catch (err) {
			return res.status(500).json({ errors: [err.message] });
		}
	}
}

// Exportación del controlador
export default UsuarioController;
