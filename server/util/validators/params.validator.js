const { param, validationResult } = require('express-validator');

exports.validateParams = [
    param('id')
        .isNumeric().withMessage('El ID debe ser un valor numérico.'),
    param('id')
        .custom(value => {
            if (value < 1) {
                throw new Error('El ID debe ser un valor positivo.');
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