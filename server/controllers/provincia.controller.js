// Importación de los servicios necesarios
const ProvinciaService = require('../services/provincia.service');

exports.getProvincias = async (req, res) => {
  try {
    const provincias = await ProvinciaService.readProvincias();

    if (!provincias) {
      return res.status(404).json({
        errors: ['Las provincias no fueron encontradas.']
      });
    }

    return res.status(200).json(provincias);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}