const dbConn = require('../util/database/database');
const PacienteModel = require('../models/paciente.model');

class PacienteService {
    static async readPacienteByNumHistClinica(num_hist_clinica) {
        return await PacienteModel.findByNumHistClinica(dbConn, num_hist_clinica);
    }

    static async readPacienteByUserId(usuario_id) {
        return await PacienteModel.findByUserId(dbConn, usuario_id);
    }
}

module.exports = PacienteService;