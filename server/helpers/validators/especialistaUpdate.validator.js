const {body, validationResult} = require('express-validator');

exports.validateEspecialistaUpdate = [
  body('num_colegiado')
    .trim()
    .notEmpty().withMessage('El número de colegiado es requerido.')
    .isNumeric().withMessage('El número de colegiado debe ser un valor numérico.')
    .custom((value) => {
      const regex = /^\d{9}$/;

      if (!regex.test(value)) {
        throw new Error('El número de colegiado debe tener 9 dígitos.');
      }

      if (value < 1) {
        throw new Error('El número de colegiado no puede ser 0 o negativo.');
      }

      return true;
    }),
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es requerida.')
    .isString().withMessage('La descripción debe ser una cadena de texto.'),
  body('turno')
    .trim()
    .notEmpty().withMessage('El turno es requerido.')
    .isString().withMessage('El turno debe ser una cadena de texto.'),
  body('especialidad_id')
    .trim()
    .notEmpty().withMessage('La especialidad es requerida.')
    .isNumeric().withMessage('La especialidad debe ser un valor numérico.'),
  body('consulta_id')
    .trim()
    .notEmpty().withMessage('La consulta es requerida.')
    .isNumeric().withMessage('La consulta debe ser un valor numérico.'),
  body('imagen')
    .trim()
    .notEmpty().withMessage('La imagen del especialista no puede estar vacía.')
    .isString().withMessage('La imagen del especialista es requerida.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.validationErrors = errors.array().map(error => error.msg);

      return res.status(400).json({errors: req.validationErrors});
    }
    next();
  }
]