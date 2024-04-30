const PacienteTomaMedicamentoService = require('../services/pacienteTomaMedicamento.service');
const PdfService = require('../services/pdf.service');

exports.getRecetas = async (req, res) => {
  let paciente_id = req.params.usuario_id;

  if (req.user_role === 2) {
    paciente_id = req.user_id;
  } else if (req.user_role === 3) {
    paciente_id = req.params.usuario_id;
  }

  try {
    const prescripciones = await PacienteTomaMedicamentoService.findPrescripciones(paciente_id);

    if (!prescripciones || prescripciones.length === 0) {
      return res.status(404).json({
        errors: ['No hay recetas para este paciente.']
      });
    }

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

    return res.status(200).json({
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
    const tomaExists = await PacienteTomaMedicamentoService.findToma(toma_id);

    if (!tomaExists || tomaExists.length === 0) {
      return res.status(404).json({
        errors: ['La toma no existe.']
      });
    }

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
    const medicamentoExists = await PacienteTomaMedicamentoService.findMedicamento(paciente_id, medicamento_id);

    if (!medicamentoExists || medicamentoExists.length === 0) {
      return res.status(404).json({
        errors: ['El medicamento no existe.']
      });
    }

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

    if (!prescripciones || prescripciones.prescripciones.length === 0) {
      return res.status(404).json({
        errors: ['No hay recetas para este paciente.']
      });
    }

    const file = await PdfService.generateReceta(prescripciones);

    res.status(200).download(file, async (err) => {
      await PdfService.destroyPDF(file)
      if (err) {
        console.error('Error al descargar el archivo:', err);
      }
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}