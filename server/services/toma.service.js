const TomaModel = require('../models/toma.model');
const dbConn = require('../util/database/database');

class TomaService {
    static async createToma(conn, prescripcion) {
        try {
            return await TomaModel.createToma(conn, prescripcion);
        } catch (error) {
            throw new Error('Error al guardar la toma.');
        }
    }

    static async deleteToma(conn, id) {
        try {
            await TomaModel.deleteToma(conn, id);
        } catch (error) {
            throw new Error('Error al eliminar la toma.');
        }
    }
}

module.exports = TomaService;