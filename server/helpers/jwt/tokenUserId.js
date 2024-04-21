const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split('Bearer ')[1];
        try {
            const decodedToken =
                jwt.verify(token, process.env.JWT_SECRET_KEY);

            /* Extraer el userId del token decodificado
             * y almacenarlo en el objeto req. */
            req.user_id = decodedToken.user_id;

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