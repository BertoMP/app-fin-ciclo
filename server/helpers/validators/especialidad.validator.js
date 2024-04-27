const {body, validationResult } = require("express-validator");

exports.validateEspecialidad = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre de la especialidad no puede estar vacío.')
        .isString().withMessage('El nombre de la especialidad debe ser una cadena de texto'),
    body('descripcion')
        .trim()
        .notEmpty().withMessage('La descripción de la especialidad no puede estar vacía.')
        .isString().withMessage('La descripción de la especialidad es requerida.'),
    body('imagen')
        .trim()
        .notEmpty().withMessage('La imagen de la especialidad no puede estar vacía.')
        .isString().withMessage('La imagen de la especialidad es requerida.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.validationErrors = errors.array().map(error => error.msg);
        }
        next();
    }
];