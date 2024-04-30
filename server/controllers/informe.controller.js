const InformeService = require('../services/informe.service');
const CitaService = require('../services/cita.service');
const PdfService = require("../services/pdf.service");

exports.getInforme = async (req, res) => {
  const user_role = req.user_role;
  const informe_id = parseInt(req.params.informe_id);

  try {
    const informe = await fetchInforme(user_role, informe_id, req, res);

    if (!informe) {
      return res.status(404).json({
        errors: ['Informe no encontrado.']
      });
    }

    return res.status(200).json(informe);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.generaInformePDF = async (req, res) => {
  const user_role = req.user_role;
  const informe_id = parseInt(req.params.informe_id);

  try {
    const informe = await fetchInforme(user_role, informe_id, req, res);

    if (!informe) {
      return res.status(404).json({
        errors: ['Informe no encontrado.']
      });
    }

    const file = await PdfService.generateInforme(informe);

    res.status(200).download(file, async (err) => {
      await PdfService.destroyPDF(file);
      if (err) {
        console.error('Error al descargar el archivo:', err);
      }
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }

}

exports.createInforme = async (req, res) => {
  try {
    let contenido = req.body.contenido;
    contenido = contenido.replace(/(\r\n|\n|\r)/g, '<br>');

    const informe = {
      motivo: req.body.motivo,
      patologias: req.body.patologias,
      contenido: contenido,
      cita_id: req.body.cita_id
    }

    await InformeService.createInforme(informe);

    return res.status(200).json({
      message: 'Informe creado correctamente.'
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

async function fetchInforme(user_role, informe_id, req, res) {
  const pacienteId = await CitaService.readPacienteIdByInformeId(informe_id);

  if (!pacienteId) {
    return res.status(404).json({
      errors: ['Informe no encontrado.']
    });
  }

  if (user_role === 2 && pacienteId !== req.user_id) {
    return res.status(403).json({
      errors: ['No tienes permiso para realizar esta acción.']
    });
  }

  return await InformeService.readInforme(informe_id);
}