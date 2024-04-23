const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    if (accessToken) {
        const token = accessToken.split('Bearer ')[1];
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
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