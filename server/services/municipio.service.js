const dbConn = require('../util/database/database');
const MunicipioModel = require('../models/municipio.model');

class MunicipioService {
    static async readMunicipioByProvinciaId(id) {
        return await MunicipioModel.fetchByProvinciaId(dbConn, id);
    }
}

module.exports = MunicipioService;