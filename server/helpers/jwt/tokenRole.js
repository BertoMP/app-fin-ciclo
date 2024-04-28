const jwt = require('jsonwebtoken');

module.exports = (roles) => {
  return (req, res, next) => {
    let accessToken = req.headers['authorization'];
    if (accessToken) {
      accessToken = accessToken.split('Bearer ')[1];
      try {
        const decodedToken =
          jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

        if (!decodedToken || !roles.includes(decodedToken.user_role)) {
          return res.status(403).json({
            errors: ['No tienes permiso para realizar esta acción.']
          });
        }

        req.user_role = decodedToken.user_role;

        next();
      } catch (error) {
        return res.status(403).json({
          errors: ['Token inválido.']
        });
      }
    } else {
      return res.status(403).json({
        errors: ['No se proporcionó ningún token.']
      });
    }
  }
}