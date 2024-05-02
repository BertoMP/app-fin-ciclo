// Importación de las librerías necesarias
import pkg from 'jsonwebtoken';
const { sign } = pkg;

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

/**
 * @name createRefreshToken
 * @description Genera un token de refresco para el usuario que inicia sesión
 *              en la aplicación y que le permitirá mantener la sesión activa
 *              por un tiempo determinado.
 * @function
 * @memberof Helpers-JWT
 * @param {Object} user - Objeto con los datos del usuario
 * @returns {string} - Token de refresco
 */
export const createRefreshToken = (user) => {
	// Creación del payload con los datos del usuario
	const payload = {
		user_id: user.id,
		user_role: user.rol_id,
	};

	// Retorno del token de refresco
	return sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
		expiresIn: '7d',
	});
};
