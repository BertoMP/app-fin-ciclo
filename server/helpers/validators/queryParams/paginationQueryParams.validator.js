const { query, validationResult } = require('express-validator');

exports.validatePaginationQueryParams = [
    query('page')
        .optional()
        .isNumeric().withMessage('El número de página debe ser un valor numérico.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];