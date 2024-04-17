const { param, validationResult } = require('express-validator');

exports.validateParams = [
    param('id')
        .optional()
        .isNumeric().withMessage('El ID debe ser un valor numérico.')
        .custom(value => {
            if (value < 1) {
                throw new Error('El ID debe ser un valor positivo.');
            }

            return true;
        }),
    param('idMedicamento')
        .optional()
        .isNumeric().withMessage('El ID del medicamento debe ser un valor numérico.')
        .custom(value => {
            if (value < 1) {
                throw new Error('El ID del medicamento debe ser un valor positivo.');
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