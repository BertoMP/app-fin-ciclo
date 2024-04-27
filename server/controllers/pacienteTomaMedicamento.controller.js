const PacienteTomaMedicamentoService = require('../services/pacienteTomaMedicamento.service');
const PdfService = require('../services/pdf.service');
const destroyFile = require("../util/functions/destroyFile");

exports.getRecetas = async (req, res) => {
    let paciente_id = req.params.usuario_id;

    if (req.user_role === 2) {
        paciente_id = req.user_id;
    } else if (req.user_role === 3) {
        paciente_id = req.params.usuario_id;
    }

    try {
        const prescripciones = await PacienteTomaMedicamentoService.findPrescripciones(paciente_id);

        return res.status(200).json(prescripciones);
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }

}

exports.postReceta = async (req, res) => {
    const paciente_id = req.body.paciente_id;
    const prescripcion = req.body.prescripcion;

    try {
        await PacienteTomaMedicamentoService.createPrescripcion(paciente_id, prescripcion);

        return res.status(201).json({
            message: 'Receta guardada correctamente.'
        });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}

exports.deleteToma = async (req, res) => {
    const toma_id = req.params.toma_id;

    try {
        await PacienteTomaMedicamentoService.deleteToma(toma_id);

        return res.status(200).json({
            message: 'Toma eliminada correctamente.'
        });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}

exports.deleteMedicamento = async (req, res) => {
    const paciente_id = req.params.usuario_id;
    const medicamento_id = req.params.medicamento_id;

    try {
        await PacienteTomaMedicamentoService.deleteMedicamento(paciente_id, medicamento_id);

        return res.status(200).json({
            message: 'Medicamento eliminado correctamente.'
        });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}

exports.getRecetaPDF = async (req, res) => {
    let paciente_id = 0;

    if (req.user_role === 2) {
        paciente_id = req.user_id;
    } else if (req.user_role === 3) {
        paciente_id = req.params.usuario_id;
    }

    try {
        const prescripciones = await PacienteTomaMedicamentoService.findPrescripciones(paciente_id);

        const file = await PdfService.generateReceta(prescripciones);

        res.download(file, (err) => {
            if (err) {
                destroyFile(file, true);
                return res.status(500).json({
                    errors: [err.message]
                });
            } else {
                destroyFile(file, true);
            }
        });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}