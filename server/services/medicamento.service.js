const dbConn = require('../util/functions/database');
const MedicamentoModel = require('../models/medicamento.model');

class MedicamentoService {
    static async readMedicamentos(page) {
        return await MedicamentoModel.fetchAll(dbConn, page);
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

    static async deleteMedicamento(id) {
        await MedicamentoModel.deleteById(dbConn, id);
    }

    static async updateMedicamento(id, medicamento) {
        await MedicamentoModel.updateById(dbConn, id, medicamento);
    }
}

module.exports = MedicamentoService;