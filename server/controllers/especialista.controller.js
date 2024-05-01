// Importación de los servicios necesarios
const EspecialistaService = require('../services/especialista.service');

exports.getEspecialistaById = async (req, res) => {
  const id = parseInt(req.params.usuario_id);

  try {
    const especialista = await EspecialistaService.readEspecialistaById(id);

    if (!especialista || especialista.turno === 'no-trabajando') {
      return res.status(404).json({
        errors: ['Especialista no encontrado.']
      });
    }

    return res.status(200).json(especialista);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}