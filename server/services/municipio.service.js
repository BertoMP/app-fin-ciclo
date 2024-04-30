const dbConn = require('../util/database/database');
const MunicipioModel = require('../models/municipio.model');

class MunicipioService {
  static async readMunicipioByProvinciaId(id, conn = dbConn) {
    return await MunicipioModel.fetchByProvinciaId(id, conn);
  }
}

module.exports = MunicipioService;