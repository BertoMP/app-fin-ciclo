const dbConn = require('../util/database/database');
const GlucometriaModel = require('../models/glucometria.model');

class GlucometriaService {
    static async readGlucometria(searchValues) {
        return await GlucometriaModel.fetchAll(dbConn, searchValues);
    }

    static async createGlucometria(glucometria) {
        return await GlucometriaModel.create(dbConn, glucometria);
    }
}

module.exports = GlucometriaService;