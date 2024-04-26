const pacienteTomaMedicamentoService = require('../services/pacienteTomaMedicamento.service');

exports.getRecetas = async (req, res) => {
    let paciente_id = req.params.usuario_id;

    // if (req.user_role === 2) {
    //     paciente_id = req.user_id;
    // } else if (req.user_role === 3) {
    //     paciente_id = req.params.usuario_id;
    // }

    try {
        const prescripciones = await pacienteTomaMedicamentoService.findPrescripciones(paciente_id);

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
        await pacienteTomaMedicamentoService.createPrescripcion(paciente_id, prescripcion);

        return res.status(201).json({
            message: 'Receta guardada correctamente.'
        });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}