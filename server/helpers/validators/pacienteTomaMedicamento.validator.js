// Importación de las librerías necesarias
const { body, validationResult } = require('express-validator');

/**
 * @name validatePacienteRegister
 * @description Middleware que valida el cuerpo de la solicitud para el registro de un paciente.
 *              Valida 'tipo_via', 'nombre_via', 'numero', 'piso', 'puerta', 'codigo_postal', 'municipio', 'tel_fijo', 'tel_movil', y 'fecha_nacimiento'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
const validatePacienteTomaMedicamento = [
  body('paciente_id')
    .trim()
    .notEmpty().withMessage('El paciente es requerido.')
    .isNumeric().withMessage('El paciente debe ser un valor numérico.'),
  body('prescripcion')
    .isArray().withMessage('La prescripción de medicamentos debe ser un arreglo de objetos.'),
  body('prescripcion.*.medicamento_id')
    .trim()
    .notEmpty().withMessage('El medicamento es requerido.')
    .isNumeric().withMessage('El medicamento debe ser un valor numérico.'),
  body('prescripcion.*.tomas')
    .isArray().withMessage('Las tomas del medicamento deben ser un arreglo de objetos.'),
  body('prescripcion.*.tomas.*.toma_id')
    .custom(value => value === null || typeof value === 'number').withMessage('El identificador de la toma debe ser null o un valor numérico.'),
  body('prescripcion.*.tomas.*.dosis')
    .trim()
    .notEmpty().withMessage('La dosis es requerida.')
    .isNumeric().withMessage('La dosis debe ser un valor numérico.'),
  body('prescripcion.*.tomas.*.hora')
    .trim()
    .notEmpty().withMessage('La hora de toma es requerida.')
    .isString().withMessage('La hora de toma debe ser un valor alfanumérico.')
    .custom(value => {
      const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:00$/;
      if (!regex.test(value)) {
        throw new Error('La hora de toma debe tener el formato HH:MM:00.');
      }

      return true;
    }),
  body('prescripcion.*.tomas.*.fecha_inicio')
    .trim()
    .notEmpty().withMessage('La fecha de inicio es requerida.')
    .isDate().withMessage('La fecha de inicio debe ser un valor de fecha.')
    .custom(value => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(value)) {
        throw new Error('La fecha de inicio debe tener el formato YYYY-MM-DD.');
      }

      const fechaAyer = new Date();
      fechaAyer.setDate(fechaAyer.getDate() - 1);
      fechaAyer.setHours(0, 0, 0, 0);

      if (new Date(value) < fechaAyer) {
        throw new Error('La fecha de inicio no puede ser menor a la fecha actual.');
      }

      return true;
    }),
  body('prescripcion.*.tomas.*.fecha_fin')
    .trim()
    .optional()
    .isDate().withMessage('La fecha de fin debe ser un valor de fecha.')
    .custom((value, {req, path}) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(value)) {
        throw new Error('La fecha de fin debe tener el formato YYYY-MM-DD.');
      }

      const fechaAyer = new Date();
      fechaAyer.setDate(fechaAyer.getDate() - 1);
      fechaAyer.setHours(0, 0, 0, 0);

      if (new Date(value) < fechaAyer) {
        throw new Error('La fecha de fin no puede ser menor a la fecha actual.');
      }

      const pathParts = path.split('.');
      const medicamentoIndex = pathParts[1];
      const tomaIndex = pathParts[3];

      if (req.body.prescripcion[medicamentoIndex] && req.body.prescripcion[medicamentoIndex].tomas[tomaIndex]) {
        const fechaInicio = req.body.prescripcion[medicamentoIndex].tomas[tomaIndex].fecha_inicio;

        if (new Date(value) < new Date(fechaInicio)) {
          throw new Error('La fecha de fin no puede ser menor que la fecha de inicio.');
        }
      }

      return true;
    }),
  body('prescripcion.*.tomas.*.observaciones')
    .trim()
    .optional()
    .isString().withMessage('Las observaciones deben ser un valor alfanumérico.'),

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
module.exports = validatePacienteTomaMedicamento;