const { body, validationResult } = require('express-validator');

exports.validateGlucometria = [
    body('medicion')
        .trim()
        .notEmpty().withMessage('La medición es requerida.')
        .isNumeric().withMessage('La medición debe ser un valor numérico.')
        .custom(value => {
            if (value < 0) {
                throw new Error('La medición no puede ser un valor negativo.');
            }

            const regex = /^\d{2,3}$/;
            if (!regex.test(value)) {
                throw new Error('La medición debe tener entre 2 y 3 dígitos.');
            }

            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(500).json({ errors: errorMessages });
        }
        next();
    }
];