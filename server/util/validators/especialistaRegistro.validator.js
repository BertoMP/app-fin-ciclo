const { body, validationResult, check} = require('express-validator');
const EspecialistaService = require('../../services/especialista.service');

const { validateImage } = require("./imagen.validator");

const destroyFile = require("../functions/destroyFile");

exports.validateEspecialistaRegister = [
    validateImage,
    body('num_colegiado')
        .trim()
        .notEmpty().withMessage('El número de colegiado es requerido.')
        .isNumeric().withMessage('El número de colegiado debe ser un valor numérico.')
        .custom(async (value, { req }) => {
            const regex = /^\d{9}$/;

            if (!regex.test(value)) {
                throw new Error('El número de colegiado debe tener 9 dígitos.');
            }

            if (value < 1) {
                throw new Error('El número de colegiado no puede ser 0 o negativo.');
            }

            const especialistaExists
                = await EspecialistaService.readEspecialistaByNumColegiado(value);

            if (especialistaExists && especialistaExists.usuario_id !== req.params.id) {
                throw new Error('El número de colegiado ya existe en la base datos.');
            }

            return true;
        }),
    body('descripcion')
        .trim()
        .notEmpty().withMessage('La descripción es requerida.')
        .isString().withMessage('La descripción debe ser una cadena de texto.'),
    body('turno')
        .trim()
        .notEmpty().withMessage('El turno es requerido.')
        .isString().withMessage('El turno debe ser una cadena de texto.'),
    body('especialidad_id')
        .trim()
        .notEmpty().withMessage('La especialidad es requerida.')
        .isNumeric().withMessage('La especialidad debe ser un valor numérico.'),
    body('consulta_id')
        .trim()
        .notEmpty().withMessage('La consulta es requerida.')
        .isNumeric().withMessage('La consulta debe ser un valor numérico.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file && req.file.path) {
                destroyFile(req.file.path);
            }
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]