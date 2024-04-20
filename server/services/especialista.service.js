const dbConn = require('../util/database/database');
const EspecialistaModel = require('../models/especialista.model');

class EspecialistaService {
    static async readEspecialistaByNumColegiado(num_colegiado) {
        return await EspecialistaModel.findByNumColegiado(dbConn, num_colegiado);
    }

    static async readEspecialistaByConsultaId(consulta_id) {
        return await EspecialistaModel.findByConsultaId(dbConn, consulta_id);
    }

    static async readEspecialistaByEspecialistaId(especialista_id) {
        return await EspecialistaModel.findEspecialistaById(dbConn, especialista_id);
    }
}

module.exports = EspecialistaService;