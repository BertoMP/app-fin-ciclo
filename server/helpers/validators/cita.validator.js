// Importación de las librerías necesarias
const { body, validationResult } = require('express-validator');

/**
 * @name validateCita
 * @description Middleware que valida el cuerpo de la solicitud para una cita.
 *              Valida 'paciente_id', 'especialista_id', 'fecha' y 'hora'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @function
 * @memberof Helpers-Validators-Body
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
const validateCita = [
  body('paciente_id')
    .trim()
    .notEmpty().withMessage('El paciente es requerido')
    .isNumeric().withMessage('El paciente debe ser un número'),
  body('especialista_id')
    .trim()
    .notEmpty().withMessage('El especialista es requerido')
    .isNumeric().withMessage('El especialista debe ser un número'),
  body('fecha')
    .trim()
    .notEmpty().withMessage('La fecha es requerida')
    .isDate().withMessage('La fecha debe ser una fecha válida')
    .custom((value) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(value)) {
        throw new Error('La fecha debe ser un formato YYYY-MM-DD');
      }

      const fechaAyer = new Date();
      fechaAyer.setDate(fechaAyer.getDate() - 1);
      fechaAyer.setHours(0, 0, 0, 0);

      if (new Date(value) < fechaAyer) {
        throw new Error('La fecha de cita no puede ser menor a la fecha actual.');
      }

      return true;
    }),
  body('hora')
    .trim()
    .notEmpty().withMessage('La hora es requerida')
    .isString().withMessage('La hora debe ser un texto')
    .custom((value) => {
      const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:00$/;
      if (!regex.test(value)) {
        throw new Error('La hora debe ser un formato HH:mm:ss');
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
module.exports = validateCita;