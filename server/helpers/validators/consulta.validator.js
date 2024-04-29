const {body, validationResult} = require('express-validator');

exports.validateConsulta = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío.')
    .isString().withMessage('El nombre debe ser una cadena de texto.')
    .custom((value) => {
      const regex = /^[1-9]\d?-[A-Z]$/

      if (!regex.test(value)) {
        throw new Error('El nombre debe ser un nombre ' +
          'válido 1-2 caracteres numéricos (el primero no puede ' +
          'ser 0) seguidos de un guión y una letra mayúscula.')
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
]