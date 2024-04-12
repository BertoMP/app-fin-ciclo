const { body, validationResult } = require('express-validator');
const UsuarioService = require('../../services/usuario.service');

exports.validateUserRegister = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es requerido.')
        .isEmail().withMessage('El correo debe ser un correo válido.')
        .custom(async (value, { req }) => {
            const usuario = await UsuarioService.readUsuarioByEmail(value);
            if (usuario && usuario.id !== req.params.id) {
                throw new Error('El correo ya está en uso.');
            }
            return true;
        }),

    body('password')
        .trim()
        .notEmpty().withMessage('La contraseña es requerida.')
        .isString().withMessage('La contraseña debe ser una cadena de texto.')
        .custom((value) => {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            return regex.test(value);
        }).withMessage('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.'),

    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido.')
        .isString().withMessage('El nombre debe ser una cadena de texto.'),

    body('primer_apellido')
        .trim()
        .notEmpty().withMessage('El primer apellido es requerido.')
        .isString().withMessage('El primer apellido debe ser una cadena de texto.'),

    body('segundo_apellido')
        .trim()
        .notEmpty().withMessage('El segundo apellido es requerido.')
        .isString().withMessage('El segundo apellido debe ser una cadena de texto.'),

    body('dni')
        .trim()
        .notEmpty().withMessage('El DNI es requerido.')
        .isString().withMessage('El DNI debe ser una cadena de texto.')
        .custom((value) => {
            const regex = /^[0-9]{8}[A-Z]$/;
            return regex.test(value);
        }).withMessage('El DNI debe tener 8 dígitos y una letra mayúscula al final.')
        .custom(async (value, { req }) => {
            const usuario = await UsuarioService.readUsuarioByDNI(value);
            if (usuario && usuario.id !== req.params.id) {
                throw new Error('El DNI ya está en uso.');
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