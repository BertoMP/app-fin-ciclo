const dbConn = require('../util/database/database');
const InformeModel = require('../models/informe.model');

class InformeService {
    static async readInforme(id) {
        return await InformeModel.fetchById(dbConn, id);
    }

    static async createInforme(informe) {
        return await InformeModel.create(dbConn, informe);
    }
}

module.exports = InformeService;