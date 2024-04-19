const dbConn = require('../util/database/database');
const CitaModel = require('../models/cita.model');

class CitaService {
    static async readCitas(page, paciente_id) {
        await CitaModel.fetchAll(dbConn, page, paciente_id);
    }

    static async readCitaById(id) {
        await CitaModel.fetchById(dbConn, id);
    }

    static async readCitaByData(cita) {
        await CitaModel.fetchByData(dbConn, cita);
    }

    static async readCitasAgenda(especialista_id) {
        await CitaModel.fetchAgenda(dbConn, especialista_id);
    }

    static async createCita(cita) {
        await CitaModel.createCita(dbConn, cita);
    }

    static async deleteCita(id) {
        await CitaModel.deleteCita(dbConn, id);
    }
}

module.exports = CitaService;
