const dbConn = require('../util/database/database');
const CitaModel = require('../models/cita.model');

class CitaService {
    static async readCitas(searchValues) {
        return await CitaModel.fetchAll(dbConn, searchValues);
    }

    static async readCitaById(id) {
        return await CitaModel.fetchById(dbConn, id);
    }

    static async readCitaByData(cita) {
        return await CitaModel.fetchByData(dbConn, cita);
    }

    static async readCitasAgenda(especialista_id) {
        return await CitaModel.fetchAgenda(dbConn, especialista_id);
    }

    static async readPacienteIdByInformeId(informe_id) {
        return await CitaModel.fetchPacienteIdByInformeId(dbConn, informe_id);
    }

    static async createCita(cita) {
        return await CitaModel.createCita(dbConn, cita);
    }

    static async deleteCita(id) {
        return await CitaModel.deleteCita(dbConn, id);
    }
}

module.exports = CitaService;
