const dbConn = require('../util/database/database');
const PatologiaModel = require('../models/patologia.model');

class PatologiaService {
  static async readPatologiasInforme(conn = dbConn) {
    return await PatologiaModel.fetchAllInforme(conn);
  }

  static async readPatologias(page, limit, conn = dbConn) {
    return await PatologiaModel.fetchAll(page, limit, conn);
  }

  static async readPatologiaById(id, conn = dbConn) {
    return await PatologiaModel.findById(id, conn);
  }

  static async readPatologiaByNombre(nombre, conn = dbConn) {
    return await PatologiaModel.findByNombre(nombre, conn);
  }

  static async createPatologia(patologia, conn = dbConn) {
    await PatologiaModel.save(patologia, conn);
  }

  static async updatePatologia(id, patologia, conn = dbConn) {
    await PatologiaModel.updateById(id, patologia, conn);
  }
}

module.exports = PatologiaService;