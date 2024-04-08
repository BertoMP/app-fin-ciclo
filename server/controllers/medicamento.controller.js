const MedicamentoService = require('../services/medicamento.service');
const { body, validationResult } = require('express-validator');

exports.validateMedicamento = [
    // Nombre no debe estar vacío y debe ser una cadena de texto
    body('nombre')
        .isString()
        .withMessage('El nombre del medicamento debe ser una cadena de texto'),

    body('nombre')
        .notEmpty()
        .withMessage('El nombre del medicamento es requerido'),

    // Descripción no debe estar vacío y debe ser una cadena de texto
    body('descripcion')
        .isString()
        .withMessage('La descripción del medicamento debe ser una cadena de texto'),

    body('descripcion')
        .notEmpty()
        .withMessage('La descripción del medicamento es requerida.'),

    // Procesar los resultados de la validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores de validación, enviar una respuesta con los errores
            return res.status(400).json({ errors: errors.array() });
        }
        // Si no hay errores de validación, continuar con el siguiente middleware
        next();
    }
];

exports.getMedicamentos = async (req, res) => {
    const page = parseInt(req.query.page) || 1;

    try {
        if (isNaN(page)) {
            throw new Error('Número de página inválido.');
        }

        const medicamentos = await MedicamentoService.readMedicamentos(page);
        res.status(200).json(medicamentos);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getMedicamentoById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        const medicamento = await MedicamentoService.readMedicamentoById(id);
        res.status(200).json(medicamento);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.postMedicamento = async (req, res) => {
    const medicamento = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion
    }

    try {
        await MedicamentoService.createMedicamento(medicamento);

        res.status(200).json({ message: 'Medicamento creado.'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteMedicamento = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        await MedicamentoService.deleteMedicamento(id);

        res.status(200).json({ message: 'Medicamento eliminado.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateMedicamento = async (req, res) => {
    const id = parseInt(req.params.id);
    const medicamento = req.body;

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        await MedicamentoService.updateMedicamento(id, medicamento);

        res.status(200).json({ message: 'Medicamento actualizado.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}