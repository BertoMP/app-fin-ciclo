const {body, validationResult} = require("express-validator");

exports.validateUserLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es requerido.')
        .custom((value) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!regex.test(value)) {
                throw new Error('El correo debe ser un correo válido.');
            }

            return true;
            }),

    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.')
        .isString().withMessage('La contraseña debe ser una cadena de texto.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];