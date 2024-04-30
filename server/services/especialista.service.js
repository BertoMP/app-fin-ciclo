const dbConn = require('../util/database/database');
const EspecialistaModel = require('../models/especialista.model');

class EspecialistaService {
  static async create(especialista, conn = dbConn) {
    return await EspecialistaModel.create(especialista, conn);
  }

  static async readEspecialistaById(id, conn = dbConn) {
    return await EspecialistaModel.findById(id, conn);
  }

  static async readEspecialistaByNumColegiado(num_colegiado, conn = dbConn) {
    return await EspecialistaModel.findByNumColegiado(num_colegiado, conn);
  }

  static async readEspecialistaByConsultaId(consulta_id, conn = dbConn) {
    return await EspecialistaModel.findByConsultaId(consulta_id, conn);
  }

  static async readEspecialistaByEspecialistaId(especialista_id, conn = dbConn) {
    return await EspecialistaModel.findEspecialistaById(especialista_id, conn);
  }

  static async update(especialista_id, conn = dbConn) {
    return await EspecialistaModel.update(especialista_id, conn);
  }
}

module.exports = EspecialistaService;