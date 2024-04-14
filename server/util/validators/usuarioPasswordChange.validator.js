const { body, validationResult } = require('express-validator');

exports.validateUserPasswordChange = [
    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.')
        .isString().withMessage('La contraseña debe ser una cadena de texto.')
        .custom((value) => {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            return regex.test(value);
        }).withMessage('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.'),

    body('confirm-password')
        .trim()
        .notEmpty().withMessage('La confirmación de la contraseña es requerida.')
        .isString().withMessage('La confirmación de la contraseña debe ser una cadena de texto.')
        .custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage('Las contraseñas no coinciden.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(500).json({ errors: errorMessages });
        }
        next();
    }
]