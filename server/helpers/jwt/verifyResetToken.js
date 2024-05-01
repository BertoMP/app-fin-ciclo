const jwt = require('jsonwebtoken');

const verifyResetToken = (req, res) => {
  const resetToken = req.body.token;

  return new Promise((resolve) => {
    jwt.verify(resetToken, process.env.JWT_RESET_SECRET_KEY, (err, decodedToken) => {
      if (err || !decodedToken) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            errors: ['El token ha expirado. Solicita un nuevo enlace.']
          });
        } else {
          return res.status(401).json({
            errors: ['Token inválido o expirado.']
          });
        }
      }

      resolve(decodedToken.email);
    });
  });
}

module.exports = verifyResetToken;