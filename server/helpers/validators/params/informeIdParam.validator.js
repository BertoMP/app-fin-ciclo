const {param, validationResult} = require('express-validator');

exports.validateInformeIdParam = [
  param('informe_id')
    .isNumeric().withMessage('El ID del informe debe ser un valor numérico.')
    .custom(value => {
      if (value < 1) {
        throw new Error('El ID del informe debe ser un valor positivo.');
      }

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      return res.status(400).json({errors: errorMessages});
    }
    next();
  }
];