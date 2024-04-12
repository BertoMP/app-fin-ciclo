const dbConn = require('../util/functions/database');
const PacienteModel = require('../models/paciente.model');

class PacienteService {
    static async readPacienteByNumHistClinica(num_hist_clinica) {
        return await PacienteModel.findByNumHistClinica(dbConn, num_hist_clinica);
    }
}

module.exports = PacienteService;