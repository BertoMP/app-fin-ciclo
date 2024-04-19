const { body, validationResult } = require('express-validator');

exports.validateInforme = [
    body('motivo')
        .trim()
        .notEmpty().withMessage('El motivo es requerido.')
        .isString().withMessage('El motivo debe ser un texto.'),
    body('patologia')
        .trim()
        .notEmpty().withMessage('La patología es requerida.')
        .isString().withMessage('La patología debe ser un texto.'),
    body('contenido')
        .trim()
        .notEmpty().withMessage('El contenido es requerido.')
        .isString().withMessage('El contenido debe ser un texto.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];