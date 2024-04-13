const jwt = require('jsonwebtoken');

const createResetToken = (user) => {
    const payload = {
        email: user.email
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY,
        { expiresIn: '1h'
        });
}

module.exports = createResetToken;