// Importación del modelo del servicio
import UsuarioModel from '../models/usuario.model.js';

// Importación de los servicios auxiliares
import PacienteService from './paciente.service.js';
import EspecialistaService from './especialista.service.js';
import EmailService from "./email.service.js";
import CitaService from "./cita.service.js";
import TokenService from "./token.service.js";

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";
import pkg from 'bcryptjs';
import {
	createEncryptedPassword,
	generateRandomPassword
} from "../util/functions/createEncryptedPassword.js";

const { compare } = pkg;

/**
 * @class UsuarioService
 * @description Clase que contiene los métodos para interactuar con el modelo de Usuario.
 */
class UsuarioService {
	/**
	 * @method readAllUsuarios
	 * @description Método para leer todos los usuarios.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de usuarios.
	 */
	static async readAllUsuarios(searchValues, conn = dbConn) {
		try {
			const page = searchValues.page;
			const role_id = searchValues.role;
			const search = searchValues.search;
			const limit = searchValues.limit;

			const {
				formattedRows: resultados,
				actualPage: pagina_actual,
				total: cantidad_usuarios,
				totalPages: paginas_totales,
			} = await UsuarioModel.fetchAll(searchValues, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página solicitada no existe.');
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

			return {
				resultados,
				pagina_actual,
				cantidad_usuarios,
				paginas_totales,
				prev,
				next,
				result_min,
				result_max,
				items_pagina,
			};
		} catch (err) {
			throw err;
		}

		return await UsuarioModel.fetchAll(searchValues, conn);
	}

	/**
	 * @method readUsuarioById
	 * @description Método para leer un usuario por su ID.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El usuario.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async readUsuarioById(id, conn = dbConn) {
		try {
			const userRole = await UsuarioModel.getRoleByUserId(id, conn);

			if (!userRole) {
				throw new Error('El usuario no existe.');
			}

			switch (userRole.rol_id) {
				case 1:
					throw new Error('El usuario es un admin.');
				case 2:
					return await PacienteService.readPacienteByUserId(id, conn);
				case 3:
					return await EspecialistaService.readEspecialistaByUserId(id, true, conn);
			}
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method createUsuario
	 * @description Método para crear un nuevo usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param data - Los datos del usuario a crear.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá creado un nuevo usuario y un nuevo paciente en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createUsuario(data, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const emailExists = await UsuarioModel.findByEmail(data.datos_personales.email, conn);

			if (emailExists) {
				throw new Error('El correo electrónico ya está en uso.');
			}

			const dniExists = await UsuarioModel.findByDNI(data.datos_personales.dni, conn);

			if (dniExists) {
				throw new Error('El DNI ya está en uso.');
			}

			if (data.datos_especialista) {
				const colegiadoExists = await EspecialistaService.readEspecialistaByNumColegiado(data.datos_especialista.num_colegiado, conn);

				if (colegiadoExists) {
					throw new Error('El número de colegiado ya está en uso.');
				}
			}

			if (!data.datos_personales.password) {
				data.datos_personales.password = generateRandomPassword();
			}

			const usuario = await ObjectFactory.createUserObject(data);
			const nuevoUsuario = await UsuarioModel.create(usuario, conn);

			if (usuario.rol_id === 2) {
				const paciente = ObjectFactory.createPacienteObject(data);
				paciente.usuario_id = nuevoUsuario.usuario_id;
				await PacienteService.createPaciente(paciente, conn);
				await EmailService.sendWelcomeEmail(usuario.email, usuario.nombre);
			} else {
				const especialista = ObjectFactory.createEspecialistaObject(data);
				especialista.usuario_id = nuevoUsuario.usuario_id;
				await EspecialistaService.createEspecialista(especialista, conn);
				await EmailService.sendWelcomeEmailSpecialist(usuario.email, data.datos_personales.password, usuario.nombre);
			}

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw err;
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method userLogin
	 * @description Método para iniciar sesión de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {string} email - El correo electrónico del usuario.
	 * @param {string} password - La contraseña del usuario.
	 * @param {Object} [conn=dbConn] - La conexión a la base de datos.
	 * @returns {Promise<{accessToken, refreshToken}>} Los tokens de acceso y actualización.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async userLogin(email, password, conn = dbConn) {
		try {
			const user = await UsuarioModel.findByEmail(email, conn);

			if (!user) {
				throw new Error('Correo o contraseña incorrectos.');
			}

			if (user.datos_rol.rol_id === 3) {
				const isTrabajando = await EspecialistaService.readTurnoByEspecialistaId(user.usuario_id, conn);

				if (isTrabajando.turno === 'no-trabajando') {
					throw new Error('Cuenta deshabilitada.');
				}

				if (!isTrabajando) {
					throw new Error('El especialista no está trabajando.');
				}
			}

			const validPassword = await compare(password, user.datos_personales.password);

			if (!validPassword) {
				throw new Error('Correo o contraseña incorrectos.');
			}

			const accessToken = TokenService.createAccessToken(user);
			const refreshToken = TokenService.createRefreshToken(user);

			await UsuarioModel.updateRefreshToken(user.usuario_id, refreshToken, conn);

			return {
				accessToken,
				refreshToken
			};
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method userLogout
	 * @description Método para cerrar sesión de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación del token de actualización.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async userLogout(id, conn = dbConn) {
		return await UsuarioModel.deleteRefreshToken(id, conn);
	}

	/**
	 * @method userLogout
	 * @description Método para cerrar sesión de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {string} email - El correo electrónico del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá eliminado el token de actualización del usuario en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async forgotPassword(email, conn = dbConn) {
		try {
			const user = await UsuarioModel.findByEmail(email, conn);

			if (!user) {
				throw new Error('Correo no encontrado.');
			}

			const resetToken = TokenService.createResetToken(user);

			await TokenService.createToken(user.usuario_id, resetToken, conn);
			await EmailService.sendPasswordResetEmail(email, user, resetToken);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method resetPassword
	 * @description Método para restablecer la contraseña de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {string} email - El correo electrónico del usuario.
	 * @param {string} password - La nueva contraseña del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá restablecido la contraseña del usuario en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async resetPassword(email, password, conn = dbConn) {
		try {
			const user = await UsuarioModel.findByEmail(email, conn);

			if (!user) {
				throw new Error('Correo no encontrado.');
			}

			const encryptedPassword = await createEncryptedPassword(password);
			await UsuarioModel.updatePassword(user.datos_personales.email, encryptedPassword, conn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method updatePassword
	 * @description Método para actualizar la contraseña de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} data - Los datos del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá actualizado la contraseña del usuario en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updatePassword(userId, data, conn = dbConn) {
		try {
			const userPassword = await UsuarioModel.getPasswordById(userId, conn);

			if (!userPassword) {
				throw new Error('Usuario no encontrado.');
			}

			const correctPassword = await compare(data.oldPassword, userPassword.password);

			if (!correctPassword) {
				throw new Error('La contraseña actual no es correcta.');
			}

			const samePassword = await compare(data.password, userPassword.password);

			if (samePassword) {
				throw new Error('La nueva contraseña no puede ser igual a la actual.');
			}

			const user = await UsuarioModel.findById(userId, conn);

			const encryptedPassword = await createEncryptedPassword(data.password);
			await UsuarioModel.updatePassword(user.datos_personales.email, encryptedPassword, conn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method updateUsuario
	 * @description Método para actualizar un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} usuario_id - El ID del usuario.
	 * @param data - Los datos del usuario a actualizar.
	 * @param {boolean} isAdmin - Si el usuario es un administrador.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá actualizado el usuario y el paciente o especialista asociado en la base de datos.
	 */
	static async updateUsuario(usuario_id, isAdmin, data, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			if (!isAdmin) {
				const password = data.datos_personales.password;
				const realPassword = await UsuarioModel.getPasswordById(usuario_id, conn);

				const validPassword = await compare(password, realPassword.password);

				if (!validPassword) {
					throw new Error('La contraseña actual no es correcta.');
				}
			}

			const emailExists = await UsuarioModel.findByEmail(data.datos_personales.email, conn);

			if (emailExists && emailExists.usuario_id !== usuario_id) {
				throw new Error('El correo electrónico ya está en uso.');
			}

			const dniExists = await UsuarioModel.findByDNI(data.datos_personales.dni, conn);

			if (dniExists && dniExists.usuario_id !== usuario_id) {
				throw new Error('El DNI ya está en uso.');
			}

			if (data.datos_especialista) {
				const colegiadoExists = await EspecialistaService.readEspecialistaByNumColegiado(data.datos_especialista.num_colegiado, conn);

				if (colegiadoExists && colegiadoExists.usuario_id !== usuario_id) {
					throw new Error('El número de colegiado ya está en uso.');
				}
			}

			const existingUser = await UsuarioModel.findById(usuario_id, conn);

			if (!existingUser) {
				throw new Error('El usuario no existe.');
			}

			if (existingUser.datos_rol.rol_id === 1) {
				throw new Error('El usuario es un admin.');
			}

			const usuario = ObjectFactory.updateUserObject(data);

			await UsuarioModel.updateUsuario(usuario, conn);

			if (data.datos_paciente) {
				const paciente = ObjectFactory.updatePacienteObject(data);
				await PacienteService.updatePaciente(paciente, conn);
			} else {
				const especialista = ObjectFactory.updateEspecialistaObject(data);
				await EspecialistaService.updateEspecialista(especialista, conn);
			}

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw new Error(err);
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method readEmailByUserId
	 * @description Método para leer el correo electrónico de un usuario por su ID.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<{email}>} El correo electrónico del usuario.
	 */
	static async readEmailByUserId(id, conn = dbConn) {
		return await UsuarioModel.getEmailById(id, conn);
	}

	/**
	 * @method updateRefreshToken
	 * @description Método para actualizar el token de actualización de un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {string} refreshToken - El token de actualización.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de actualización.
	 */
	static async updateRefreshToken(refreshToken, conn = dbConn) {
		try {
			if (!refreshToken) {
				throw new Error('No se ha proporcionado un token de refresco.');
			}

			const decodedToken = TokenService.verifyRefreshToken(refreshToken);

			if (!decodedToken) {
				throw new Error('El token no es válido.');
			}

			const userId = decodedToken.user_id;
			const userToken = await UsuarioModel.getRefreshTokenById(userId, conn);

			if (!userToken) {
				throw new Error('El usuario no existe.');
			}

			if (userToken.refresh_token !== refreshToken) {
				throw new Error('El token no es válido.');
			}

			const user = await UsuarioModel.findById(userId, conn);

			const newAccessToken = TokenService.createAccessToken(user);
			const newRefreshToken = TokenService.createRefreshToken(user);

			await UsuarioModel.updateRefreshToken(decodedToken.user_id, newRefreshToken, conn);

			return {
				new_access_token: newAccessToken,
				new_refresh_token: newRefreshToken,
			};
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method deleteUsuario
	 * @description Método para eliminar un usuario.
	 * @static
	 * @async
	 * @memberof UsuarioService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteUsuario(id, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			const userExists = await UsuarioModel.findById(id, conn);

			if (!userExists) {
				throw new Error('El usuario no existe.');
			}

			const userRole = userExists.datos_rol.rol_id;

			switch (userRole) {
				case 1:
					throw new Error('El usuario es un admin.');
				case 2:
					await PacienteService.deletePaciente(id, conn);
					await UsuarioModel.deleteUsuario(id, conn);
					break;
				case 3:
					const especialistaCita = await CitaService.readCitasByEspecialistaId(id, conn);
					if (especialistaCita.length > 0) {
						await EspecialistaService.setNoTrabajando(id, conn);
						await UsuarioModel.deleteRefreshToken(id, conn);

						for (const cita of especialistaCita) {
							if (!cita.informe_id) {
								await CitaService.deleteCita(cita.id, conn);
							}
						}
					} else {
						await EspecialistaService.deleteEspecialista(id, conn);
						await UsuarioModel.deleteUsuario(id, conn);
					}
					break;
			}

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw err;
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}
}

// Exportación del servicio
export default UsuarioService;
