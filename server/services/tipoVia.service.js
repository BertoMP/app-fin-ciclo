// Importación del modelo del servicio
const TipoViaModel  = require('../models/tipoVia.model');

// Importación de las utilidades necesarias
const dbConn        = require('../util/database/database');

/**
 * @class TipoViaService
 * @description Clase que contiene los métodos para interactuar con el modelo de TipoVia.
 */
class TipoViaService {
  /**
   * @method readTipoVia
   * @description Método para leer todos los tipos de vías.
   * @static
   * @async
   * @memberof TipoViaService
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de tipos de vías.
   */
  static async readTipoVia(conn = dbConn) {
    return await TipoViaModel.fetchAll(conn);
  }
}

// Exportación del servicio
module.exports = TipoViaService;