// Importación del modelo del servicio
const EspecialistaModel = require('../models/especialista.model');

// Importación de utilidades necesarias
const dbConn = require('../util/database/database');

/**
 * @class EspecialistaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Especialista.
 */
class EspecialistaService {
  /**
   * @method create
   * @description Método para crear un nuevo especialista.
   * @static
   * @async
   * @memberOf EspecialistaService
   * @param {Object} especialista - El objeto del nuevo especialista.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El nuevo especialista creado.
   */
  static async create(especialista, conn = dbConn) {
    return await EspecialistaModel.create(especialista, conn);
  }

  /**
   * @method readEspecialistaById
   * @description Método para leer un especialista por su ID.
   * @static
   * @async
   * @memberOf EspecialistaService
   * @param {number} id - El ID del especialista.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El especialista.
   */
  static async readEspecialistaById(id, conn = dbConn) {
    return await EspecialistaModel.findById(id, conn);
  }

  /**
   * @method readEspecialistaByNumColegiado
   * @description Método para leer un especialista por su número de colegiado.
   * @static
   * @async
   * @memberOf EspecialistaService
   * @param {number} num_colegiado - El número de colegiado del especialista.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El especialista.
   */
  static async readEspecialistaByNumColegiado(num_colegiado, conn = dbConn) {
    return await EspecialistaModel.findByNumColegiado(num_colegiado, conn);
  }

  /**
   * @method readEspecialistaByConsultaId
   * @description Método para leer un especialista por su ID de consulta.
   * @static
   * @async
   * @memberof EspecialistaService
   * @param {number} consulta_id - El ID de la consulta del especialista.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El especialista.
   */
  static async readEspecialistaByConsultaId(consulta_id, conn = dbConn) {
    return await EspecialistaModel.findByConsultaId(consulta_id, conn);
  }

  /**
   * @method readEspecialistaByEspecialistaId
   * @description Método para leer un especialista por su ID de especialista.
   * @static
   * @async
   * @memberof EspecialistaService
   * @param {number} especialista_id - El ID del especialista.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El especialista.
   */
  static async readEspecialistaByEspecialistaId(especialista_id, conn = dbConn) {
    return await EspecialistaModel.findEspecialistaById(especialista_id, conn);
  }

  /**
   * @method updateEspecialista
   * @description Método para actualizar un especialista por su ID.
   * @static
   * @async
   * @memberof EspecialistaService
   * @param {Object} especialista - El especialista a actualizar.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El especialista actualizado.
   */
  static async updateEspecialista(especialista, conn = dbConn) {
    return await EspecialistaModel.updateEspecialista(especialista, conn);
  }
}

// Exportación del servicio
module.exports = EspecialistaService;