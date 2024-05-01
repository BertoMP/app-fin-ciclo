// Importación de las librerías necesarias
const jwt = require('jsonwebtoken');

/**
 * @name createResetToken
 * @description Genera un token de restablecimiento de contraseña para el usuario
 *              que solicita restablecer su contraseña en la aplicación.
 * @function
 * @memberof Helpers-JWT
 * @param {Object} user - Objeto con los datos del usuario
 * @returns {string} - Token de restablecimiento de contraseña
 */
const createResetToken = (user) => {
  const payload = {
    email: user.email
  };

  return jwt.sign(payload, process.env.JWT_RESET_SECRET_KEY,
    {
      expiresIn: '5h'
    });
}

module.exports = createResetToken;