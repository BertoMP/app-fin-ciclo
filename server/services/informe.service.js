// Importación del modelo del servicio
const InformeModel              = require('../models/informe.model');

// Importación de servicios auxiliares
const PatologiaService          = require('./patologia.service');
const InformePatologiaService   = require('./informePatologia.service');
const CitaService               = require('./cita.service');

// Importación de utilidades necesarias
const dbConn                    = require('../util/database/database');

/**
 *
 */
class InformeService {
  /**
   * @method readInforme
   * @description Método para leer un informe por su ID.
   * @static
   * @async
   * @memberof InformeService
   * @param {number} id - El ID del informe.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa el informe.
   */
  static async readInforme(id, conn = dbConn) {
    return await InformeModel.fetchById(id, conn);
  }

  /**
   * @method createInforme
   * @description Método para crear un informe.
   * @static
   * @async
   * @memberof InformeService
   * @param {Object} informe - Los datos del informe.
   * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
   * @returns {Promise<Object>} Un objeto que representa el informe creado.
   * @throws {Error} Si la patología no existe, se lanza un error.
   */
  static async createInforme(informe, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      const informeCreado = await InformeModel.create(informe, conn);

      const informeId = informeCreado.insertId;

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

  /**
   * @method deleteInforme
   * @description Método para eliminar un informe.
   * @static
   * @async
   * @memberof InformeService
   * @param {number} id - El ID del informe.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   */
  static async deleteInforme(id, conn = dbConn) {
    return await InformeModel.deleteInforme(id, conn);
  }
}

// Exportación del servicio
module.exports = InformeService;