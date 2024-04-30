const dbConn = require('../util/database/database');
const ProvinciaModel = require('../models/provincia.model');

class ProvinciaService {
  static async readProvincias(conn = dbConn) {
    return await ProvinciaModel.fetchAll(conn);
  }
}

module.exports = ProvinciaService;
