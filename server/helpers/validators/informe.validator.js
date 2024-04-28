const {body, validationResult} = require('express-validator');

exports.validateInforme = [
  body('cita_id')
    .trim()
    .notEmpty().withMessage('La cita es requerida.')
    .isNumeric().withMessage('La cita debe ser un número.'),
  body('motivo')
    .trim()
    .notEmpty().withMessage('El motivo es requerido.')
    .isString().withMessage('El motivo debe ser un texto.'),
  body('patologias')
    .isArray().withMessage('Las patologías deben ser un arreglo de texto.'),
  body('patologias.*')
    .trim()
    .notEmpty().withMessage('El id de la patología es requerido.')
    .isNumeric().withMessage('El id de la patología debe ser un número.'),
  body('contenido')
    .trim()
    .notEmpty().withMessage('El contenido es requerido.')
    .isString().withMessage('El contenido debe ser un texto.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      return res.status(409).json({errors: errorMessages});
    }
    next();
  }
];