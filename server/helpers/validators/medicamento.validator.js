const {body, validationResult} = require("express-validator");

exports.validateMedicamento = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del medicamento es requerido')
    .isString().withMessage('El nombre del medicamento debe ser una cadena de texto'),
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción del medicamento es requerida.')
    .isString().withMessage('La descripción del medicamento debe ser una cadena de texto'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      return res.status(400).json({errors: errorMessages});
    }
    next();
  }
];