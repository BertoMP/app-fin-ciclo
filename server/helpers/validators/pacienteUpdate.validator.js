const {body, validationResult} = require('express-validator');

exports.validatePacienteUpdate = [
  body('tipo_via')
    .trim()
    .notEmpty().withMessage('El tipo de vía es requerido.')
    .isNumeric().withMessage('El tipo de vía ha de ser un valor numérico'),

  body('nombre_via')
    .trim()
    .notEmpty().withMessage('El nombre de la vía es requerido.')
    .isString().withMessage('El nombre de la vía debe ser una cadena de texto.'),

  body('numero')
    .trim()
    .notEmpty().withMessage('El número es requerido.')
    .isNumeric().withMessage('El número debe ser un valor numérico.')
    .custom((value) => {
      if (value < 1) {
        throw new Error('El número no puede ser 0 o negativo.');
      }
      return true;
    }),

  body('piso')
    .trim()
    .notEmpty().withMessage('El piso es requerido.')
    .isNumeric().withMessage('El piso debe ser un valor numérico.')
    .custom((value) => {
      if (value < 1) {
        throw new Error('El piso no puede ser 0 o negativo.');
      }
      return true;
    }),

  body('puerta')
    .trim()
    .isString().withMessage('La puerta debe ser una cadena de texto.')
    .isString().withMessage('La puerta debe ser una cadena de texto.')
    .custom((value) => {
      const regex = /^[1-9]\d?|[A-Z]$/;

      if (!regex.test(value)) {
        throw new Error('La puerta debe ser una letra mayúscula.');
      }
      return true;
    }),

  body('codigo_postal')
    .trim()
    .notEmpty().withMessage('El código postal es requerido.')
    .isNumeric().withMessage('El código postal debe ser un valor numérico.')
    .custom((value) => {
      const regex = /^[0-9]{5}$/;

      if (!regex.test(value)) {
        throw new Error('El código postal debe tener 5 dígitos.');
      }
      return true;
    }),

  body('municipio')
    .trim()
    .notEmpty().withMessage('El municipio es requerido.')
    .isNumeric().withMessage('El municipio debe ser un valor numérico.'),

  body('tel_fijo')
    .trim()
    .notEmpty().withMessage('El teléfono fijo es requerido.')
    .isString().withMessage('El teléfono fijo debe ser una cadena de texto.')
    .custom((value) => {
      const regex = /^((\+34|0034|34)-)?9[0-9]{8}$/;

      if (!regex.test(value)) {
        throw new Error('El teléfono fijo debe tener 9 dígitos.');
      }
      return true;
    }),

  body('tel_movil')
    .trim()
    .notEmpty().withMessage('El teléfono móvil es requerido.')
    .isString().withMessage('El teléfono móvil debe ser una cadena de texto.')
    .custom((value) => {
      const regex = /^((\+34|0034|34)-)?[6|7][0-9]{8}$/;

      if (!regex.test(value)) {
        throw new Error('El teléfono móvil debe tener 9 dígitos.');
      }
      return true;
    }),

  body('fecha_nacimiento')
    .trim()
    .notEmpty().withMessage('La fecha de nacimiento es requerida.')
    .isDate().withMessage('La fecha de nacimiento debe ser una fecha válida.')
    .custom((value) => {
      const fecha_nacimiento = new Date(value);
      const fecha_actual = new Date();
      let edad = fecha_actual.getFullYear() - fecha_nacimiento.getFullYear();

      const mes = fecha_actual.getMonth() - fecha_nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && fecha_actual.getDate() < fecha_nacimiento.getDate())) {
        edad--;
      }

      if (edad > 120) {
        throw new Error('La edad del paciente no puede ser mayor a 120 años.');
      } else if (edad < 0) {
        throw new Error('La edad no puede ser negativa');
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