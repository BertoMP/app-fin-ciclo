// Importación de las librerías necesarias
const jwt = require('jsonwebtoken');

/**
 * @name verifyAccessToken
 * @description Middleware que verifica el token de autorización en el
 *              encabezado de la solicitud.
 *              Si el token es válido, extrae el user_id y user_role del token
 *              y los adjunta al objeto req.
 *              Si el token no es válido o ha expirado, envía una respuesta con
 *              el estado 401 o 403 y un mensaje de error.
 *              Si el token es válido, llama a la función next() para pasar al
 *              siguiente middleware o ruta.
 * @function
 * @memberof Helpers-JWT
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
const verifyAccessToken = (req, res, next) => {
  const accessToken = req.headers['authorization'];
  if (accessToken) {
    const token = accessToken.split('Bearer ')[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user_id = decodedToken.user_id;
      req.user_role = decodedToken.user_role;

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          errors: ['El token ha expirado. Inicia sesión de nuevo.']
        });
      } else {
        return res.status(403).json({
          errors: ['Token inválido.']
        });
      }
    }
  } else {
    return res.status(403).json({
      errors: ['No se proporcionó ningún token.']
    });
  }
};

// Exportación del middleware
module.exports = verifyAccessToken;