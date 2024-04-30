const dbConn = require('../util/database/database');
const TensionArterialModel = require('../models/tensionArterial.model');

class TensionArterialService {
  static async readTensionArterial(searchValues, limit, conn = dbConn) {
    return await TensionArterialModel.fetchAll(searchValues, limit, conn);
  }

  static async createTensionArterial(tensionArterial, conn = dbConn) {
    return await TensionArterialModel.create(tensionArterial, conn);
  }

  static async deleteTensionArterialByUserId(userId, conn = dbConn) {
    return await TensionArterialModel.deleteTensionesArterialesByUserId( userId, conn);
  }
}

module.exports = TensionArterialService;