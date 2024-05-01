// Importación del modelo del servicio
const InformePatologiaModel   = require('../models/informePatologia.model');

// Importación de utilidades necesarias
const dbConn                  = require('../util/database/database');

/**
 * @class InformePatologiaService
 * @description Clase que contiene los métodos para interactuar con el modelo de InformePatologia.
 */
class InformePatologiaService {
  /**
   * @method addInformePatologia
   * @description Método para añadir una patología a un informe.
   * @static
   * @async
   * @memberof InformePatologiaService
   * @param {number} informeId - El ID del informe.
   * @param {number} patologiaId - El ID de la patología.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de adición.
   */
  static async addInformePatologia(informeId, patologiaId, conn = dbConn) {
    return await InformePatologiaModel.addPatologia(informeId, patologiaId, conn);
  }

  /**
   * @method deletePatologiaByInformeId
   * @description Método para eliminar una patología de un informe por el ID del informe.
   * @static
   * @async
   * @memberof InformePatologiaService
   * @param {number} informeId - El ID del informe.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   */
  static async deletePatologiaByInformeId(informeId, conn = dbConn) {
    return await InformePatologiaModel.deletePatologiaByInformeId(informeId, conn);
  }
}

// Exportación del servicio
module.exports = InformePatologiaService;