const jwt = require("jsonwebtoken");

const createRefreshToken = (user) => {
    const payload = {
        user_id: user.id,
        user_role: user.rol_id
    }

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: '10h'
    });
}

module.exports = createRefreshToken;