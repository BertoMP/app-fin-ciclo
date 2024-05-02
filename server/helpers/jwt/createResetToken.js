// Importación de las librerías necesarias
import pkg from 'jsonwebtoken';
const { sign } = pkg;

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

/**
 * @name createResetToken
 * @description Genera un token de restablecimiento de contraseña para el usuario
 *              que solicita restablecer su contraseña en la aplicación.
 * @function
 * @memberof Helpers-JWT
 * @param {Object} user - Objeto con los datos del usuario
 * @returns {string} - Token de restablecimiento de contraseña
 */
export const createResetToken = (user) => {
	const payload = {
		email: user.email,
	};

	return sign(payload, process.env.JWT_RESET_SECRET_KEY, {
		expiresIn: '5h',
	});
};
