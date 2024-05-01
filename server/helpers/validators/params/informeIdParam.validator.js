// Importación las librerías necesarias
const { param, validationResult } = require('express-validator');

/**
 * @name validateInformeIdParam
 * @description Middleware que valida el parámetro 'informe_id' en la ruta.
 *              Si 'informe_id' no es numérico o es menor que 1, se envía una respuesta
 *              con el estado 400 y un mensaje de error.
 *              Si 'informe_id' es válido, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Params
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
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