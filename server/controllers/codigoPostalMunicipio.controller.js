const CodigoPostalMunicipioService = require('../services/codigoPostalMunicipio.service');

exports.getCodigoPostal = async (req, res) => {
    try {
        const cod_municipio = req.params.municipio_id;

        const codigoPostal =
            await CodigoPostalMunicipioService.readCodigoPostalByMunicipioId(cod_municipio);

        if (!codigoPostal) {
            return res.status(404).json({
                errors: ['No se ha encontrado el código postal.']
            });
        }

        return res.status(200).json(codigoPostal);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}