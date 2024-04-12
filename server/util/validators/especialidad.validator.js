const {body, validationResult, check} = require("express-validator");
const destroyFile = require("../functions/destroyFile");
const { validateImage } = require("./imagen.validator");
const EspecialidadService = require("../../services/especialidad.service");

exports.validateEspecialidad = [
    validateImage,
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre de la especialidad no puede estar vacío.')
        .isString().withMessage('El nombre de la especialidad debe ser una cadena de texto')
        .custom(async (value, { req }) => {
            const especialidadExists
                = await EspecialidadService.readEspecialidadByNombre(value);

            if (especialidadExists && especialidadExists.id !== parseInt(req.params.id)) {
                throw new Error('Ya existe una especialidad con ese nombre.');
            }
            return true;
        }),
    body('descripcion')
        .trim()
        .notEmpty().withMessage('La descripción de la especialidad no puede estar vacía.')
        .isString().withMessage('La descripción de la especialidad es requerida.'),

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
];