const { body, validationResult } = require('express-validator');

exports.validatePacienteRegister = [
    body('tipo_via')
        .trim()
        .notEmpty().withMessage('El tipo de vía es requerido.')
        .isString().withMessage('El tipo de vía debe ser una cadena de texto.')
        .custom((value) => {
            const tipos_via = ['calle', 'avenida', 'paseo', 'plaza', 'camino', 'carretera', 'vía'];

            if (!tipos_via.includes(value.toLowerCase())) {
                throw new Error('El tipo de vía no es válido.');
            }
            return true;
        }),

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
        .isNumeric().withMessage('El piso debe ser un valor numérico.')
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

    body('provincia')
        .trim()
        .notEmpty().withMessage('La provincia es requerida.')
        .isString().withMessage('La provincia debe ser una cadena de texto.'),

    body('municipio')
        .trim()
        .notEmpty().withMessage('El municipio es requerido.')
        .isString().withMessage('El municipio debe ser una cadena de texto.'),

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
            const edad = fecha_actual.getFullYear() - fecha_nacimiento.getFullYear();

            if (edad < 18) {
                throw new Error('El paciente debe ser mayor de edad.');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];