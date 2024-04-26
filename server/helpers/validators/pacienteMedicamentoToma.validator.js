const { body, validationResult } = require('express-validator');

exports.validatePacienteMedicamentoToma = [
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

            if (new Date(value) < new Date()) {
                throw new Error('La fecha de inicio no puede ser menor a la fecha actual.');
            }

            return true;
        }),
    body('prescripcion.*.tomas.*.fecha_fin')
        .trim()
        .optional()
        .isDate().withMessage('La fecha de fin debe ser un valor de fecha.')
        .custom((value, { req, path }) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(value)) {
                throw new Error('La fecha de fin debe tener el formato YYYY-MM-DD.');
            }

            if (new Date(value) < new Date()) {
                throw new Error('La fecha de fin no puede ser menor a la fecha actual.');
            }

            const pathParts = path.split('.');
            const medicamentoIndex = pathParts[1];
            const tomaIndex = pathParts[3];

            // Comprobación de que los elementos existen antes de intentar acceder a sus propiedades
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

            return res.status(409).json({ errors: errorMessages });
        }
        next();
    }
];