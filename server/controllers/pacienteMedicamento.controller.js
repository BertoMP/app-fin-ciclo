const pacienteMedicamentoService = require('../services/pacienteMedicamento.service');
const PdfService = require('../services/pdf.service');
const destroyFile = require('../util/functions/destroyFile');

exports.getPacienteMedicamento = async (req, res) => {
    let paciente_id = 0;

    if (req.user_role === 2) {
        paciente_id = req.user_id;
    } else if (req.user_role === 3) {
        paciente_id = req.params.paciente_id;
    }

    try {
        const medicamentos = await pacienteMedicamentoService.readPacienteMedicamento(paciente_id);

        return res.status(200).json(medicamentos);
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}

exports.getPacienteMedicamentoPDF = async (req, res) => {
    let paciente_id = 0;

    if (req.user_role === 2) {
        paciente_id = req.user_id;
    } else if (req.user_role === 3) {
        paciente_id = req.params.paciente_id;
    }

    try {
        const medicamentos = await pacienteMedicamentoService.readPacienteMedicamento(paciente_id);

        const file = await PdfService.generateReceta(medicamentos);

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

exports.postPacienteMedicamento = async (req, res) => {
    try {
        const medicamento_id = req.body.medicamento_id;
        const paciente_id = req.body.paciente_id;
        const toma_diurna = req.body.toma_diurna;
        const toma_vespertina = req.body.toma_vespertina;
        const toma_nocturna = req.body.toma_nocturna;

        const medicamentoPacienteExists = await pacienteMedicamentoService.findMedicamentoInPaciente(paciente_id, medicamento_id);

        if (medicamentoPacienteExists.length > 0) {
            return res.status(409).json({ message: 'El medicamento ya está en la receta del paciente.' });
        }

        const medicamentoPaciente = {
            medicamento_id: medicamento_id,
            paciente_id: paciente_id,
            toma_diurna: toma_diurna,
            toma_vespertina: toma_vespertina,
            toma_nocturna: toma_nocturna
        }

        await pacienteMedicamentoService.createPacienteMedicamento(medicamentoPaciente);

        return res.status(200).json({ message: 'Medicamento añadido a la receta del paciente.' });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}

exports.putPacienteMedicamento = async (req, res) => {
    try {
        const paciente_id = req.params.id;
        const medicamento_id = req.params.idMedicamento;
        const toma_diurna = req.body.toma_diurna;
        const toma_vespertina = req.body.toma_vespertina;
        const toma_nocturna = req.body.toma_nocturna;

        const medicamentoPacienteExists = await pacienteMedicamentoService.findMedicamentoInPaciente(paciente_id, medicamento_id);

        if (medicamentoPacienteExists.length === 0) {
            return res.status(409).json({ message: 'El medicamento no está en la receta del paciente.' });
        }

        const medicamentoPaciente = {
            paciente_id: paciente_id,
            medicamento_id: medicamento_id,
            toma_diurna: toma_diurna,
            toma_vespertina: toma_vespertina,
            toma_nocturna: toma_nocturna
        }

        await pacienteMedicamentoService.updatePacienteMedicamento(medicamentoPaciente);

        return res.status(200).json({ message: 'Receta del paciente actualizada.' });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}

exports.deletePacienteMedicamento = async (req, res) => {
    try {
        const paciente_id = req.params.id;
        const medicamento_id = req.params.idMedicamento;

        const medicamentoPacienteExists = await pacienteMedicamentoService.findMedicamentoInPaciente(paciente_id, medicamento_id);

        if (medicamentoPacienteExists.length === 0) {
            return res.status(409).json({ message: 'El medicamento no está en la receta del paciente.' });
        }

        const pacienteMedicamento = {
            paciente_id: paciente_id,
            medicamento_id: medicamento_id
        }

        await pacienteMedicamentoService.deletePacienteMedicamento(pacienteMedicamento);

        return res.status(200).json({ message: 'Medicamento eliminado de la receta del paciente.' });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}