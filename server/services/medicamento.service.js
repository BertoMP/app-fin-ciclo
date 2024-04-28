const dbConn = require('../util/database/database');
const MedicamentoModel = require('../models/medicamento.model');

class MedicamentoService {
  static async readMedicamentosPrescripcion() {
    return await MedicamentoModel.fetchAllPrescripcion(dbConn);
  }

  static async readMedicamentos(page, limit) {
    return await MedicamentoModel.fetchAll(dbConn, page, limit);
  }

  static async readMedicamentoById(id) {
    return await MedicamentoModel.findById(dbConn, id);
  }

  static async readMedicamentoByNombre(nombre) {
    return await MedicamentoModel.findByNombre(dbConn, nombre);
  }

  static async createMedicamento(medicamento) {
    await MedicamentoModel.save(dbConn, medicamento);
  }

  static async updateMedicamento(id, medicamento) {
    await MedicamentoModel.updateById(dbConn, id, medicamento);
  }
}

module.exports = MedicamentoService;