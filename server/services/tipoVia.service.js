const dbConn = require('../util/database/database');
const TipoViaModel = require('../models/tipoVia.model');

class TipoViaService {
  static async readTipoVia(conn = dbConn) {
    return await TipoViaModel.fetchAll(conn);
  }
}

module.exports = TipoViaService;