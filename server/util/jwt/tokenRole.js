const jwt = require('jsonwebtoken');

module.exports = (roles) => {
    return (req, res, next) => {
        let token = req.headers['authorization'];
        if (token) {
            token = token.split('Bearer ')[1];
            try {
                const decodedToken =
                    jwt.verify(token, process.env.JWT_SECRET_KEY);

                if (!decodedToken || !roles.includes(decodedToken.user_role)) {
                    return res.status(403).json({
                        errors: ['No tienes permiso para realizar esta acción.']
                    });
                }
                next();
            } catch (error) {
                return res.status(401).json({
                    errors: ['Token inválido.']
                });
            }
        } else {
            return res.status(401).json({
                errors: ['No se proporcionó ningún token.']
            });
        }
    }
}