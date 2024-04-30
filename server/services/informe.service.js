const dbConn = require('../util/database/database');
const PatologiaService = require('./patologia.service');
const InformePatologiaService = require('./informePatologia.service');
const CitaService = require('./cita.service');
const InformeModel = require('../models/informe.model');

class InformeService {
  static async readInforme(id, conn = dbConn) {
    return await InformeModel.fetchById(id, dbConn);
  }

  static async createInforme(informe, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      const informeId = await InformeModel.create(informe, conn);

      for (const patologiaId of informe.patologias) {
        const patologiaExists = await PatologiaService.readPatologiaById(patologiaId, conn);

        if (!patologiaExists) {
          throw new Error('La patología no existe.');
        }

        await InformePatologiaService.addInformePatologia(informeId, patologiaId, conn);
      }

      await CitaService.updateInformeId(informe.cita_id, informeId, conn);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }

      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async deleteInforme(id, conn = dbConn) {
    return await InformeModel.deleteInforme(id, conn);
  }
}

module.exports = InformeService;