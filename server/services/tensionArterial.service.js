// Importación del modelo del servicio
const TensionArterialModel = require('../models/tensionArterial.model');

// Importación de las utilidades necesarias
const dbConn = require('../util/database/database');

/**
 * @class TensionArterialService
 * @description Clase que contiene los métodos para interactuar con el modelo de TensionArterial.
 */
class TensionArterialService {
  /**
   * @method readTensionArterial
   * @description Método para leer todas las tensiones arteriales.
   * @static
   * @async
   * @memberof TensionArterialService
   * @param {Object} searchValues - Los valores de búsqueda.
   * @param {number} limit - El límite de resultados.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de tensiones arteriales.
   */
  static async readTensionArterial(searchValues, limit, conn = dbConn) {
    return await TensionArterialModel.fetchAll(searchValues, limit, conn);
  }

  /**
   * @method createTensionArterial
   * @description Método para crear una nueva tensión arterial.
   * @static
   * @async
   * @memberof TensionArterialService
   * @param {Object} tensionArterial - El objeto de la nueva tensión arterial.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} La nueva tensión arterial creada.
   */
  static async createTensionArterial(tensionArterial, conn = dbConn) {
    return await TensionArterialModel.create(tensionArterial, conn);
  }

  /**
   * @method deleteTensionArterialByUserId
   * @description Método para eliminar una tensión arterial por su ID de usuario.
   * @static
   * @async
   * @memberof TensionArterialService
   * @param {number} userId - El ID de usuario de la tensión arterial.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   */
  static async deleteTensionArterialByUserId(userId, conn = dbConn) {
    return await TensionArterialModel.deleteTensionesArterialesByUserId( userId, conn);
  }
}

// Exportación del servicio
module.exports = TensionArterialService;