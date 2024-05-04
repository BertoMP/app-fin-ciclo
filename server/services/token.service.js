// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

// Importación del modelo del servicio
import TokenModel from '../models/token.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;


/**
 * @class TokenService
 * @description Clase que contiene los métodos para interactuar con el modelo de Token.
 */
class TokenService {
	/**
	 * @method createAccessToken
	 * @description Método para crear un token de acceso.
	 * @static
	 * @memberof TokenService
	 * @param {Object} user - El usuario.
	 * @returns {string} El token de acceso.
	 */
	static createAccessToken(user) {
		const payload = {
			user_id: user.usuario_id,
			user_role: user.datos_rol.rol_id,
		};

		return sign(payload, process.env.JWT_SECRET_KEY, {
			expiresIn: '1d',
		});
	}

	/**
	 * @method createRefreshToken
	 * @description Método para crear un token de refresco.
	 * @static
	 * @memberof TokenService
	 * @param {Object} user - El usuario.
	 * @returns {string} El token de refresco.
	 */
	static createRefreshToken(user) {
		const payload = {
			user_id: user.usuario_id,
			user_role: user.datos_rol.rol_id,
		};

		return sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
			expiresIn: '7d',
		});
	}

	/**
	 * @method createResetToken
	 * @description Método para crear un token de restablecimiento de contraseña.
	 * @static
	 * @memberof TokenService
	 * @param {Object} user - El usuario.
	 * @returns {string} El token de restablecimiento de contraseña.
	 */
	static createResetToken(user) {
		const payload = {
			email: user.datos_personales.email,
		};

		return sign(payload, process.env.JWT_RESET_SECRET_KEY, {
			expiresIn: '5h',
		});
	}

	/**
	 * @method verifyAccessToken
	 * @description Método para verificar un token de reseteo.
	 * @static
	 * @memberof TokenService
	 * @param {string} token - El token.
	 * @returns {Object} El token verificado.
	 * @throws {Error} Si el token no es válido, lanza un error.
	 */
	static verifyResetToken(token) {
		return verify(token, process.env.JWT_RESET_SECRET_KEY);
	}

	/**
	 * @method verifyAccessToken
	 * @description Método para verificar un token de refresco.
	 * @static
	 * @memberof TokenService
	 * @param {string} token - El token.
	 * @returns {Object} El token verificado.
	 * @throws {Error} Si el token no es válido, lanza un error.
	 */
	static verifyRefreshToken(token) {
		return verify(token, process.env.JWT_REFRESH_SECRET_KEY);
	}

	/**
	 * @method createToken
	 * @description Método para crear un nuevo token.
	 * @static
	 * @async
	 * @memberof TokenService
	 * @param {number} idUser - El ID del usuario.
	 * @param {string} token - El token.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo token creado.
	 */
	static async createToken(idUser, token, conn = dbConn) {
		return await TokenModel.create(idUser, token, conn);
	}

	/**
	 * @method deleteToken
	 * @description Método para eliminar un token por su ID de usuario.
	 * @static
	 * @async
	 * @memberof TokenService
	 * @param {number} idUser - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deleteToken(idUser, conn = dbConn) {
		return await TokenModel.deleteTokensByUserId(idUser, conn);
	}
}

// Exportación del servicio
export default TokenService;
