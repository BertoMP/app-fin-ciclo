// Importación del modelo del servicio
const MedicamentoModel  = require('../models/medicamento.model');

// Importación de utilidades necesarias
const dbConn            = require('../util/database/database');

/**
 * @class MedicamentoService
 * @description Clase que contiene los métodos para interactuar con el modelo de Medicamento.
 */
class MedicamentoService {
  /**
   * @method readMedicamentosPrescripcion
   * @description Método para leer todos los medicamentos de prescripción.
   * @static
   * @async
   * @memberof MedicamentoService
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de medicamentos de prescripción.
   */
  static async readMedicamentosPrescripcion(conn = dbConn) {
    return await MedicamentoModel.fetchAllPrescripcion(conn);
  }

  /**
   * @method readMedicamentos
   * @description Método para leer todos los medicamentos.
   * @static
   * @async
   * @memberof MedicamentoService
   * @param {number} page - La página de resultados a devolver.
   * @param {number} limit - El número de resultados por página.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de medicamentos.
   */
  static async readMedicamentos(page, limit, conn = dbConn) {
    return await MedicamentoModel.fetchAll(page, limit, conn);
  }

  /**
   * @method readMedicamentoById
   * @description Método para leer un medicamento por su ID.
   * @static
   * @async
   * @memberof MedicamentoService
   * @param {number} id - El ID del medicamento.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El medicamento.
   */
  static async readMedicamentoById(id, conn = dbConn) {
    return await MedicamentoModel.findById(id, conn);
  }

  /**
   * @method readMedicamentoByNombre
   * @description Método para leer un medicamento por su nombre.
   * @static
   * @async
   * @memberof MedicamentoService
   * @param {string} nombre - El nombre del medicamento.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El medicamento.
   */
  static async readMedicamentoByNombre(nombre, conn = dbConn) {
    return await MedicamentoModel.findByNombre(nombre, conn);
  }

  /**
   * @method createMedicamento
   * @description Método para crear un nuevo medicamento.
   * @static
   * @async
   * @memberof MedicamentoService
   * @param {Object} medicamento - El objeto del nuevo medicamento.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El nuevo medicamento creado.
   */
  static async createMedicamento(medicamento, conn = dbConn) {
    await MedicamentoModel.save(medicamento, conn);
  }

  /**
   * @method updateMedicamento
   * @description Método para actualizar un medicamento por su ID.
   * @static
   * @async
   * @memberof MedicamentoService
   * @param {number} id - El ID del medicamento.
   * @param {Object} medicamento - El objeto del medicamento con los datos actualizados.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El medicamento actualizado.
   */
  static async updateMedicamento(id, medicamento, conn = dbConn) {
    await MedicamentoModel.updateById(id, medicamento, conn);
  }
}

// Exportación del servicio
module.exports = MedicamentoService;