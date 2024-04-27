const dbConn = require('../util/database/database');
const InformeModel = require('../models/informe.model');
const CitaModel = require('../models/cita.model');

class InformeService {
    static async readInforme(id) {
        return await InformeModel.fetchById(dbConn, id);
    }

    static async createInforme(informe) {
        const conn = await dbConn.getConnection();

        try {
            await conn.beginTransaction();

            const informeId = await InformeModel.create(conn, informe);

            await CitaModel.updateInformeId(conn, informe.cita_id, informeId);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw new Error(err);
        } finally {
            conn.release();
        }
    }
}

module.exports = InformeService;