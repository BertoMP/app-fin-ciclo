const { body, validationResult } = require("express-validator");

exports.validatePacienteMedicamento = [
    body('paciente_id')
        .trim()
        .notEmpty().withMessage('El id del paciente es requerido')
        .isInt().withMessage('El id del paciente debe ser un número entero'),
    body('medicamento_id')
        .trim()
        .notEmpty().withMessage('El id del medicamento es requerido')
        .isInt().withMessage('El id del medicamento debe ser un número entero'),
    body('toma_diurna')
        .trim()
        .notEmpty().withMessage('La toma diurna es requerida')
        .isString().withMessage('La toma diurna debe ser una cadena de texto'),
    body('toma_vespertina')
        .trim()
        .notEmpty().withMessage('La toma vespertina es requerida')
        .isString().withMessage('La toma vespertina debe ser una cadena de texto'),
    body('toma_nocturna')
        .trim()
        .notEmpty().withMessage('La toma nocturna es requerida')
        .isString().withMessage('La toma nocturna debe ser una cadena de texto'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];