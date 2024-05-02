import pkg from 'bcryptjs';
const { genSalt, hash } = pkg;

/**
 * @name createEncryptedPassword
 * @description Método asíncrono que crea una contraseña encriptada utilizando bcrypt.
 *              Devuelve una promesa que se resuelve con la contraseña encriptada.
 * @async
 * @function
 * @param {string} password - La contraseña que se va a encriptar.
 * @returns {Promise<string>} La contraseña encriptada.
 * @throws {Error} Si ocurre algún error durante el proceso, la promesa se rechaza con un error.
 * @memberof Util-Functions
 */
export const createEncryptedPassword = async (password) => {
	const salt = await genSalt(10);
	return await hash(password, salt);
};
