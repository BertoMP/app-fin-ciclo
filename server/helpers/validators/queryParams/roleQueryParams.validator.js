const { query, validationResult } = require('express-validator');

exports.validateRoleQueryParams = [
    query('role')
        .optional()
        .isNumeric().withMessage('El rol debe ser un valor numérico.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];