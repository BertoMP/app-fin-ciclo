// Importación de las librerías necesarias
const { body, validationResult } = require('express-validator');

/**
 * @name validateConsulta
 * @description Middleware que valida el cuerpo de la solicitud para una consulta.
 *              Valida 'nombre' que debe ser una cadena de texto y seguir el formato 1-2 caracteres numéricos (el primero no puede ser 0) seguidos de un guión y una letra mayúscula.
 *              Si 'nombre' no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si 'nombre' es válido, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @function
 * @memberof Helpers-Validators-Body
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
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