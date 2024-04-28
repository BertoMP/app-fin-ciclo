const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const payload = {
    user_id: user.id,
    user_role: user.rol_id
  }

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d'
  });
}

module.exports = createToken;