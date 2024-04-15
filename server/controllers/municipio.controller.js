const MunicipioService = require('../services/municipio.service');

exports.getMunicipio = async (req, res) => {
    try {
        const municipio = await MunicipioService.readMunicipioByProvinciaId(req.params.id);

        return res.status(200).json(municipio);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}