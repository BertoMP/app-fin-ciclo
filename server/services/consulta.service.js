const dbConn = require('../util/database/database');
const ConsultaModel = require('../models/consulta.model');

class ConsultaService {
  static async readConsultas(page, limit) {
    return await ConsultaModel.findAll(dbConn, page, limit);
  }

  static async readConsultaById(id) {
    return await ConsultaModel.findById(dbConn, id);
  }

  static async createConsulta(consulta) {
    return await ConsultaModel.create(dbConn, consulta);
  }

  static async updateConsulta(id, consulta) {
    return await ConsultaModel.update(dbConn, id, consulta);
  }

  static async deleteConsulta(id) {
    return await ConsultaModel.delete(dbConn, id);
  }

  static async readConsultaByName(nombre) {
    return await ConsultaModel.findByName(dbConn, nombre);
  }
}

module.exports = ConsultaService;