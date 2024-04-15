const TipoViaService = require('../services/tipoVia.service');

exports.getTipoVia = async (req, res) => {
    try {
        const tipoVia = await TipoViaService.readTipoVia();

        return res.status(200).json(tipoVia);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}