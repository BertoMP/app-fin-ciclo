// Importación del modelo del servicio
const TomaModel = require('../models/toma.model');

// Importación de las utilidades necesarias
const dbConn = require('../util/database/database');

/**
 * @class TomaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Toma.
 */
class TomaService {
  /**
   * @method createToma
   * @description Método para crear una nueva toma.
   * @static
   * @async
   * @memberof TomaService
   * @param {Object} prescripcion - El objeto de la nueva toma.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} La nueva toma creada.
   */
  static async createToma(prescripcion, conn = dbConn) {
    return await TomaModel.createToma(prescripcion, conn);
  }

  /**
   * @method deleteToma
   * @description Método para eliminar una toma por su ID.
   * @static
   * @async
   * @memberof TomaService
   * @param {number} id - El ID de la toma.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   */
  static async deleteToma(id, conn = dbConn) {
    return await TomaModel.deleteToma(id, conn);
  }
}

// Exportación del servicio
module.exports = TomaService;