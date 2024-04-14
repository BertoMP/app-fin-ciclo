const dbConn = require('../util/database/database');
const PacienteModel = require('../models/paciente.model');

class PacienteService {
    static async readPacienteByNumHistClinica(num_hist_clinica) {
        return await PacienteModel.findByNumHistClinica(dbConn, num_hist_clinica);
    }

    static async readPacienteByDni(dni) {
        return await PacienteModel.findByDni(dbConn, dni);
    }
}

module.exports = PacienteService;