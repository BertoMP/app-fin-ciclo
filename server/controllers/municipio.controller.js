const MunicipioService = require('../services/municipio.service');

exports.getMunicipio = async (req, res) => {
  const provinciaId = req.params.provincia_id;

  try {
    const municipio = await MunicipioService.readMunicipioByProvinciaId(provinciaId);

    if (!municipio) {
      return res.status(404).json({
        errors: ['El municipio no fue encontrado.']
      });
    }

    return res.status(200).json(municipio);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}