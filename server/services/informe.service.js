const dbConn = require('../util/database/database');
const InformeModel = require('../models/informe.model');

class InformeService {
    static async readInforme(id) {
        await InformeModel.fetchById(dbConn, id);
    }

    static async createInforme(informe) {
        await InformeModel.create(dbConn, informe);
    }
}

module.exports = InformeService;