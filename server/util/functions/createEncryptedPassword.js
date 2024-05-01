const bcrypt = require('bcryptjs');

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
const createEncryptedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

module.exports = createEncryptedPassword;