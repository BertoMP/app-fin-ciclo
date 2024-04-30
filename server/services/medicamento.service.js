const dbConn = require('../util/database/database');
const MedicamentoModel = require('../models/medicamento.model');

class MedicamentoService {
  static async readMedicamentosPrescripcion(conn = dbConn) {
    return await MedicamentoModel.fetchAllPrescripcion(conn);
  }

  static async readMedicamentos(page, limit, conn = dbConn) {
    return await MedicamentoModel.fetchAll(page, limit, conn);
  }

  static async readMedicamentoById(id, conn = dbConn) {
    return await MedicamentoModel.findById(id, conn);
  }

  static async readMedicamentoByNombre(nombre, conn = dbConn) {
    return await MedicamentoModel.findByNombre(nombre, conn);
  }

  static async createMedicamento(medicamento, conn = dbConn) {
    await MedicamentoModel.save(medicamento, conn);
  }

  static async updateMedicamento(id, medicamento, conn = dbConn) {
    await MedicamentoModel.updateById(id, medicamento, conn);
  }
}

module.exports = MedicamentoService;