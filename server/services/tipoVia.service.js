const dbConn = require('../util/database/database');
const TipoViaModel = require('../models/tipoVia.model');

class TipoViaService {
    static async readTipoVia() {
        return await TipoViaModel.fetchAll(dbConn);
    }
}

module.exports = TipoViaService;