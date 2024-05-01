// Importación del modelo del servicio
const ConsultaModel   = require('../models/consulta.model');

// Importación de utilidades necesarias
const dbConn          = require('../util/database/database');

/**
 * @class ConsultaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Consulta.
 */
class ConsultaService {
  /**
   * @method readConsultas
   * @description Método para leer consultas.
   * @static
   * @async
   * @memberOf ConsultaService
   * @param {number} page - La página de resultados.
   * @param {number} limit - El límite de resultados.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un array de consultas.
   */
  static async readConsultas(page, limit, conn = dbConn) {
    return await ConsultaModel.findAll(page, limit, conn);
  }

  /**
   * @method readConsultaById
   * @description Método para leer una consulta por su ID.
   * @static
   * @async
   * @memberof ConsultaService
   * @param {number} id - El ID de la consulta.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la consulta.
   */
  static async readConsultaById(id, conn = dbConn) {
    return await ConsultaModel.findById(id, conn);
  }

  /**
   * @method createConsulta
   * @description Método para crear una consulta.
   * @static
   * @async
   * @memberof ConsultaService
   * @param {Object} consulta - Los datos de la consulta.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la consulta creada.
   */
  static async createConsulta(consulta, conn = dbConn) {
    return await ConsultaModel.createConsulta(consulta, conn);
  }

  /**
   * @method updateConsulta
   * @description Método para actualizar una consulta.
   * @static
   * @async
   * @memberof ConsultaService
   * @param {number} id - El ID de la consulta.
   * @param {Object} consulta - Los nuevos datos de la consulta.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la consulta actualizada.
   */
  static async updateConsulta(id, consulta, conn = dbConn) {
    return await ConsultaModel.updateConsulta(id, consulta, conn);
  }

  /**
   * @method deleteConsulta
   * @description Método para eliminar una consulta.
   * @static
   * @async
   * @memberof ConsultaService
   * @param {number} id - El ID de la consulta.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la consulta eliminada.
   */
  static async deleteConsulta(id, conn = dbConn) {
    return await ConsultaModel.deleteConsulta(id, conn);
  }

  /**
   * @method readConsultaByName
   * @description Método para leer una consulta por su nombre.
   * @static
   * @async
   * @memberof ConsultaService
   * @param {string} nombre - El nombre de la consulta.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la consulta.
   */
  static async readConsultaByName(nombre, conn = dbConn) {
    return await ConsultaModel.findByName(nombre, conn);
  }
}

// Exportación del servicio
module.exports = ConsultaService;