const { body, validationResult } = require('express-validator');

exports.validateContacto = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío.')
        .isString().withMessage('El nombre debe ser una cadena de texto.'),
    body('email')
        .trim()
        .notEmpty().withMessage('El email no puede estar vacío.')
        .isEmail().withMessage('El email debe ser válido.')
        .custom((value) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!regex.test(value)) {
                throw new Error('El correo debe ser un correo válido.');
            }

            return true;
        }),
    body('telefono')
        .trim()
        .notEmpty().withMessage('El teléfono no puede estar vacío.')
        .isNumeric().withMessage('El teléfono debe ser un número.')
        .custom((value) => {
            const regex = /^((\+34|0034|34)-)?[679]\d{8}$/;

            if (!regex.test(value)) {
                throw new Error('El teléfono debe ser un teléfono válido.');
            }

            return true;
        }),
    body('mensaje')
        .trim()
        .notEmpty().withMessage('El mensaje no puede estar vacío.')
        .isString().withMessage('El mensaje debe ser una cadena de texto.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
]