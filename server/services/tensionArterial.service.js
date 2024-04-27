const dbConn = require('../util/database/database');
const TensionArterialModel = require('../models/tensionArterial.model');

class TensionArterialService {
    static async readTensionArterial(searchValues, limit) {
        return await TensionArterialModel.fetchAll(dbConn, searchValues, limit);
    }

    static async createTensionArterial(tensionArterial) {
        return await TensionArterialModel.create(dbConn, tensionArterial);
    }
}

module.exports = TensionArterialService;