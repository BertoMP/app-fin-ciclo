const { body, validationResult } = require("express-validator");
const MedicamentoService = require("../../services/medicamento.service");

exports.validateMedicamento = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre del medicamento es requerido')
        .isString().withMessage('El nombre del medicamento debe ser una cadena de texto')
        .custom(async (value, { req }) => {
            const medicamentoExists
                = await MedicamentoService.readMedicamentoByNombre(value);

            if (medicamentoExists && medicamentoExists.id !== parseInt(req.params.id)) {
                throw new Error('El medicamento ya está registrado.');
            }
            return true;
        }),
    body('descripcion')
        .trim()
        .notEmpty().withMessage('La descripción del medicamento es requerida.')
        .isString().withMessage('La descripción del medicamento debe ser una cadena de texto'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];