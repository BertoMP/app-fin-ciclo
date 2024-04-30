const dbConn = require('../util/database/database');
const EspecialidadModel = require('../models/especialidad.model');

class EspecialidadService {
  static async readEspecialidades(page, limit, conn = dbConn) {
    return await EspecialidadModel.fetchAll(page, limit, conn);
  }

  static async readEspecialidadById(id, conn = dbConn) {
    return await EspecialidadModel.findById(id, conn);
  }

  static async readEspecialidadByNombre(nombre, conn = dbConn) {
    return await EspecialidadModel.findByNombre(nombre, conn);
  }

  static async readEspecialidesEspecialistas(conn = dbConn) {
    return await EspecialidadModel.fetchAllEspecialidadesEspecialistas(conn);
  }

  static async createEspecialidad(especialidad, conn = dbConn) {
    return await EspecialidadModel.save(especialidad, conn);
  }

  static async deleteEspecialidad(id, conn = dbConn) {
    return await EspecialidadModel.deleteById(id, conn);
  }

  static async updateEspecialidad(id, especialidad, conn = dbConn) {
    return await EspecialidadModel.updateById(id, especialidad, conn);
  }
}

module.exports = EspecialidadService;