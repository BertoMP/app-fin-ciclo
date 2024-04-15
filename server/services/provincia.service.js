const dbConn = require('../util/database/database');
const ProvinciaModel = require('../models/provincia.model');

class ProvinciaService {
    static async readProvincias() {
        return await ProvinciaModel.fetchAll(dbConn);
    }
}

module.exports = ProvinciaService;
