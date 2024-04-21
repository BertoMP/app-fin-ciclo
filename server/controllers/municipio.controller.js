const MunicipioService = require('../services/municipio.service');

exports.getMunicipio = async (req, res) => {
    const provinciaId = req.params.provincia_id;

    try {
        const municipio = await MunicipioService.readMunicipioByProvinciaId(provinciaId);

        return res.status(200).json(municipio);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}