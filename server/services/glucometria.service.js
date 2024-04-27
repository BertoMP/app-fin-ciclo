const dbConn = require('../util/database/database');
const GlucometriaModel = require('../models/glucometria.model');

class GlucometriaService {
    static async readGlucometria(searchValues, limit) {
        return await GlucometriaModel.fetchAll(dbConn, searchValues, limit);
    }

    static async createGlucometria(glucometria) {
        return await GlucometriaModel.create(dbConn, glucometria);
    }
}

module.exports = GlucometriaService;