const dbConn = require('../util/database/database');
const TensionArterialModel = require('../models/tensionArterial.model');

class TensionArterialService {
    static async readTensionArterial(searchValues) {
        return await TensionArterialModel.fetchAll(dbConn, searchValues);
    }

    static async createTensionArterial(tensionArterial) {
        return await TensionArterialModel.create(dbConn, tensionArterial);
    }
}

module.exports = TensionArterialService;