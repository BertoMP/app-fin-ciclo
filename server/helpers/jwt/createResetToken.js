const jwt = require('jsonwebtoken');

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