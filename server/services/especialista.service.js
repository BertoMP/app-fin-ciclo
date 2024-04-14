const dbConn = require('../util/database/database');
const EspecialistaModel = require('../models/especialista.model');

class EspecialistaService {
    static async readEspecialistaByNumColegiado(num_colegiado) {
        return await EspecialistaModel.findByNumColegiado(dbConn, num_colegiado);
    }
}

module.exports = EspecialistaService;