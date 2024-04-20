const { body, validationResult } = require('express-validator');

exports.validateCita = [
    body('paciente_id')
        .trim()
        .notEmpty().withMessage('El paciente es requerido')
        .isNumeric().withMessage('El paciente debe ser un número'),
    body('especialista_id')
        .trim()
        .notEmpty().withMessage('El especialista es requerido')
        .isNumeric().withMessage('El especialista debe ser un número'),
    body('fecha')
        .trim()
        .notEmpty().withMessage('La fecha es requerida')
        .isDate().withMessage('La fecha debe ser una fecha válida')
        .custom((value) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(value)) {
                throw new Error('La fecha debe ser un formato YYYY-MM-DD');
            }
            return true;
        }),
    body('hora')
        .trim()
        .notEmpty().withMessage('La hora es requerida')
        .isString().withMessage('La hora debe ser un texto')
        .custom((value) => {
            const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:00$/;
            if (!regex.test(value)) {
                throw new Error('La hora debe ser un formato HH:mm:ss');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];
