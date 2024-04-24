const dbConn = require('../util/database/database');
const CodigoPostalMunicipioModel = require('../models/codigoPostalMunicipio.model');

class CodigoPostalMunicipioService {
    static async readCodigoPostalByMunicipioId(cod_municipio) {
        return await CodigoPostalMunicipioModel.findByMunicipioId(dbConn, cod_municipio);
    }
}

module.exports = CodigoPostalMunicipioService;