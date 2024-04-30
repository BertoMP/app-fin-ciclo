const PacienteService = require('../services/paciente.service');

exports.getPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteService.readPacientes();

    return res.status(200).json({ pacientes });
  } catch (err) {
    return res.status(500).json({ errors: [err.message] });
  }
}