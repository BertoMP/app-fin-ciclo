const InformePatologiaModel = require('../models/informePatologia.model');
const dbConn = require('../util/database/database');

class InformePatologiaService {
  static async addInformePatologia(informeId, patologiaId, conn = dbConn) {
    return await InformePatologiaModel.addPatologia(informeId, patologiaId, conn);
  }

  static async deletePatologiaByInformeId(informeId, conn = dbConn) {
    return await InformePatologiaModel.deletePatologiaByInformeId(informeId, conn);
  }
}

module.exports = InformePatologiaService;