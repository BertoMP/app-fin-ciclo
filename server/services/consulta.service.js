const dbConn = require('../util/database/database');
const ConsultaModel = require('../models/consulta.model');

class ConsultaService {
  static async readConsultas(page, limit, conn = dbConn) {
    return await ConsultaModel.findAll(page, limit, conn);
  }

  static async readConsultaById(id, conn = dbConn) {
    return await ConsultaModel.findById(id, conn);
  }

  static async createConsulta(consulta, conn = dbConn) {
    return await ConsultaModel.create(consulta, conn);
  }

  static async updateConsulta(id, consulta, conn = dbConn) {
    return await ConsultaModel.update(id, consulta, conn);
  }

  static async deleteConsulta(id, conn = dbConn) {
    return await ConsultaModel.delete(id, conn);
  }

  static async readConsultaByName(nombre, conn = dbConn) {
    return await ConsultaModel.findByName(nombre, conn);
  }
}

module.exports = ConsultaService;