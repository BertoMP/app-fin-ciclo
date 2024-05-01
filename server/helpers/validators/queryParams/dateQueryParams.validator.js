// Importación de las librerías necesarias
const { query, validationResult } = require('express-validator');

/**
 * @name validateDateQueryParams
 * @description Middleware que valida los parámetros de consulta 'fechaInicio' y 'fechaFin'.
 *              Si 'fechaInicio' o 'fechaFin' no son fechas válidas, o si son mayores que la fecha actual,
 *              o si 'fechaFin' es menor que 'fechaInicio', se envía una respuesta con el estado 400 y un mensaje de error.
 *              Si 'fechaInicio' y 'fechaFin' son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-QueryParams
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
const validateDateQueryParams = [
  query('fechaInicio')
    .optional()
    .isDate().withMessage('La fecha de inicio debe ser una fecha válida.')
    .custom(value => {
      if (value > new Date().toISOString().split('T')[0]) {
        throw new Error('La fecha de inicio no puede ser mayor a la fecha actual.');
      }

      return true;
    }),
  query('fechaFin')
    .optional()
    .isDate().withMessage('La fecha de fin debe ser una fecha válida.')
    .custom((value, {req}) => {
      if (value > new Date().toISOString().split('T')[0]) {
        throw new Error('La fecha de fin no puede ser mayor a la fecha actual.');
      }

      if (value < req.query.fechaInicio) {
        throw new Error('La fecha de fin no puede ser menor a la fecha de inicio.');
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

// Exportación del módulo
module.exports = validateDateQueryParams;