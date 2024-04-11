const {body, validationResult} = require("express-validator");

exports.validateUserLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es requerido.')
        .isEmail().withMessage('El correo debe ser un correo válido.'),

    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.')
        .isString().withMessage('La contraseña debe ser una cadena de texto.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];