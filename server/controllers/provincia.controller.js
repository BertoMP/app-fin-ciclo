const ProvinciaService = require('../services/provincia.service');

exports.getProvincias = async (req, res) => {
    try {
        const provincias = await ProvinciaService.readProvincias();

        return res.status(200).json(provincias);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}