const dbConn = require('../util/database/database');
const CodigoPostalMunicipioModel = require('../models/codigoPostalMunicipio.model');

class CodigoPostalMunicipioService {
  static async readCodigoPostalByMunicipioId(cod_municipio, conn = dbConn) {
    return await CodigoPostalMunicipioModel.findByMunicipioId(cod_municipio, conn);
  }
}

module.exports = CodigoPostalMunicipioService;