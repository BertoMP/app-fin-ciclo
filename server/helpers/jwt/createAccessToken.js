// Importación de las librerías necesarias
import pkg from 'jsonwebtoken';
const { sign } = pkg;

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

/**
 * @name createAccessToken
 * @description Genera un token de acceso para el usuario que inicia sesión
 *              en la aplicación y que le permitirá acceder a las rutas protegidas
 *              por un tiempo determinado.
 * @function
 * @memberof Helpers-JWT
 * @param {Object} user - Objeto con los datos del usuario
 * @returns {string} - Token de acceso
 */
export const createAccessToken = (user) => {
	const payload = {
		user_id: user.id,
		user_role: user.rol_id,
	};

	return sign(payload, process.env.JWT_SECRET_KEY, {
		expiresIn: '1d',
	});
};
