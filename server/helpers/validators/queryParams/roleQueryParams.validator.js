// Importación de las librerías necesarias
const {query, validationResult} = require('express-validator');

/**
 * @name validateRoleQueryParams
 * @description Middleware que valida el parámetro de consulta 'role'.
 *              Si 'role' no es numérico, se envía una respuesta con el estado 400 y un mensaje de error.
 *              Si 'role' es válido o no se proporciona, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-QueryParams
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
exports.validateRoleQueryParams = [
  query('role')
    .optional()
    .isNumeric().withMessage('El rol debe ser un valor numérico.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);

      return res.status(400).json({errors: errorMessages});
    }
    next();
  }
];