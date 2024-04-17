const dbConn = require('../util/database/database');
const PacienteMedicamentoModel = require('../models/pacienteMedicamento.model');

class PacienteMedicamentoService {
    static async readPacienteMedicamento(id) {
        return await PacienteMedicamentoModel.fetchAll(dbConn, id);
    }

    static async findMedicamentoInPaciente(paciente_id, medicamento_id) {
        return await PacienteMedicamentoModel.findMedicamentoInPaciente(dbConn, paciente_id, medicamento_id);
    }

    static async createPacienteMedicamento(medicamentoPaciente) {
        return await PacienteMedicamentoModel.create(dbConn, medicamentoPaciente);
    }

    static async updatePacienteMedicamento(medicamentoPaciente) {
        return await PacienteMedicamentoModel.update(dbConn, medicamentoPaciente);
    }

    static async deletePacienteMedicamento(pacienteMedicamento) {
        return await PacienteMedicamentoModel.delete(dbConn, pacienteMedicamento);
    }
}

module.exports = PacienteMedicamentoService;