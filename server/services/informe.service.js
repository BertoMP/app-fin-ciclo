const dbConn = require('../util/database/database');
const InformeModel = require('../models/informe.model');
const CitaModel = require('../models/cita.model');
const PatologiaModel = require('../models/patologia.model');
const InformePatologiaModel = require('../models/informePatologia.model');

class InformeService {
  static async readInforme(id) {
    return await InformeModel.fetchById(dbConn, id);
  }

  static async createInforme(informe) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      const informeId = await InformeModel.create(conn, informe);

      for (const patologia of informe.patologias) {
        const patologiaExists = await PatologiaModel.findById(conn, patologia);

        if (!patologiaExists) {
          throw new Error('La patología no existe.');
        }

        await InformePatologiaModel.addPatologia(conn, informeId, patologia);
      }

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