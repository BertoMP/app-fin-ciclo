const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split('Bearer ')[1];
        try {
            const decodedToken =
                jwt.verify(token, process.env.JWT_SECRET_KEY);

            let user_id = req.params.user_id;

            if (!user_id) {
                user_id = req.body.user_id;
            }

            if (decodedToken.user_role !== 3
                && decodedToken.user_id !== parseInt(user_id)) {
                return res.status(403).json({
                    errors: ['No tienes permiso para acceder a esta información.'],
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