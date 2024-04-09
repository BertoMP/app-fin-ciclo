const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split('Bearer ')[1];
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'La sesión ha expirado. Por favor, ' +
                        'inicia sesión de nuevo.'
                });
            } else {
                return res.status(401).json({ message: 'Token inválido.' });
            }
        }
    } else {
        return res.status(401).json({
            message: 'No se proporcionó ningún token.'
        });
    }
};