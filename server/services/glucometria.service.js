const dbConn = require('../util/database/database');
const GlucometriaModel = require('../models/glucometria.model');

class GlucometriaService {
  static async readGlucometria(searchValues, limit, conn = dbConn){
    return await GlucometriaModel.fetchAll(searchValues, limit, conn);
  }

  static async createGlucometria(glucometria, conn = dbConn) {
    return await GlucometriaModel.create(glucometria, conn);
  }

  static async deleteGlucometriaByUserId(userId, conn = dbConn) {
    return await GlucometriaModel.deleteGlucometriasByUserId(userId, conn);
  }
}

module.exports = GlucometriaService;