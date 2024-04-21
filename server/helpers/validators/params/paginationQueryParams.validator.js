const { query, validationResult } = require('express-validator');

exports.validatePaginationQueryParams = [
    query('page')
        .optional()
        .isNumeric().withMessage('El número de página debe ser un valor numérico.'),

    query('fechaInicio')
        .optional()
        .isDate().withMessage('La fecha de inicio debe ser una fecha válida.')
        .custom(value => {
            if (value > new Date().toISOString().split('T')[0]) {
                throw new Error('La fecha de inicio no puede ser mayor a la fecha actual.');
            }

            return true;
        }),

    query('fechaFin')
        .optional()
        .isDate().withMessage('La fecha de fin debe ser una fecha válida.')
        .custom((value, { req }) => {
            if (value > new Date().toISOString().split('T')[0]) {
                throw new Error('La fecha de fin no puede ser mayor a la fecha actual.');
            }

            if (value < req.query.fechaInicio) {
                throw new Error('La fecha de fin no puede ser menor a la fecha de inicio.');
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