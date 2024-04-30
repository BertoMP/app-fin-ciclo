const dbConn = require('../util/database/database');
const PacienteModel = require('../models/paciente.model');

class PacienteService {
  static async createPaciente(paciente, conn = dbConn) {
    return await PacienteModel.create(paciente, conn);
  }

  static async readPacientes(conn = dbConn) {
    return await PacienteModel.findAll(conn);
  }

  static async readPacienteByNumHistClinica(num_hist_clinica, conn = dbConn) {
    return await PacienteModel.findByNumHistClinica(num_hist_clinica, conn);
  }

  static async readPacienteByUserId(usuario_id, conn = dbConn) {
    return await PacienteModel.findByUserId(usuario_id, conn);
  }

  static async update(paciente_id, conn = dbConn) {
    return await PacienteModel.update(paciente_id, conn);
  }

  static async deletePacienteByUserId(usuario_id, conn = dbConn) {
    return await PacienteModel.deletePacienteByUserId(usuario_id, conn);
  }
}

module.exports = PacienteService;