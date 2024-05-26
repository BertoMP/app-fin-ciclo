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

export const generateRandomPassword = () => {
	const length = 8;
	const digits = "0123456789";
	const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
	const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const specialCharacters = "!@#$%^&*()-+=[]{}|;:,.<>?/";
	const charset = digits + lowerCaseLetters + upperCaseLetters + specialCharacters;

	let password = digits.charAt(Math.floor(Math.random() * digits.length))
		+ lowerCaseLetters.charAt(Math.floor(Math.random() * lowerCaseLetters.length))
		+ upperCaseLetters.charAt(Math.floor(Math.random() * upperCaseLetters.length))
		+ specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));

	for (let i = 4, n = charset.length; i < length; ++i) {
		password += charset.charAt(Math.floor(Math.random() * n));
	}

	password = password.split('').sort(() => 0.5 - Math.random()).join('');

	return password;
}
