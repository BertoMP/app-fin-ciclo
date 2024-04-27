const dbConn = require('../util/database/database');
const PatologiaModel = require('../models/patologia.model');

class PatologiaService {
    static async readPatologiasInforme() {
        return await PatologiaModel.fetchAllInforme(dbConn);
    }

    static async readPatologias(page) {
        return await PatologiaModel.fetchAll(dbConn, page);
    }

    static async readPatologiaById(id) {
        return await PatologiaModel.findById(dbConn, id);
    }

    static async readPatologiaByNombre(nombre) {
        return await PatologiaModel.findByNombre(dbConn, nombre);
    }

    static async createPatologia(patologia) {
        await PatologiaModel.save(dbConn, patologia);
    }

    static async updatePatologia(id, patologia) {
        await PatologiaModel.updateById(dbConn, id, patologia);
    }
}

module.exports = PatologiaService;