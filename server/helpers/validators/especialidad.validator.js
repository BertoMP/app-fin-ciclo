// Importación de las librerías necesarias
const { body, validationResult } = require("express-validator");

/**
 * @name validateEspecialidad
 * @description Middleware que valida el cuerpo de la solicitud para una especialidad.
 *              Valida 'nombre', 'descripcion' e 'imagen'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
const validateEspecialidad = [
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

      return res.status(400).json({errors: req.validationErrors});
    }
    next();
  }
];

module.exports = validateEspecialidad;