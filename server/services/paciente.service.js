// Importación del modelo del servicio
const PacienteModel   = require('../models/paciente.model');

// Importación de las utilidades necesarias
const dbConn          = require('../util/database/database');

/**
 * @class PacienteService
 * @description Clase que contiene los métodos para interactuar con el modelo de Paciente.
 */
class PacienteService {
  /**
   * @method createPaciente
   * @description Método para crear un nuevo paciente.
   * @static
   * @async
   * @memberof PacienteService
   * @param {Object} paciente - El objeto del nuevo paciente.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El nuevo paciente creado.
   */
  static async createPaciente(paciente, conn = dbConn) {
    return await PacienteModel.create(paciente, conn);
  }

  /**
   * @method readPacientes
   * @description Método para leer todos los pacientes.
   * @static
   * @async
   * @memberof PacienteService
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de pacientes.
   */
  static async readPacientes(conn = dbConn) {
    return await PacienteModel.findAll(conn);
  }

  /**
   * @method readPacienteByUserId
   * @description Método para leer un paciente por su ID de usuario.
   * @static
   * @async
   * @memberof PacienteService
   * @param {number} usuario_id - El ID de usuario del paciente.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El paciente.
   */
  static async readPacienteByUserId(usuario_id, conn = dbConn) {
    return await PacienteModel.findByUserId(usuario_id, conn);
  }

  /**
   * @method updatePacienteByUserId
   * @description Método para actualizar un paciente por su ID.
   * @static
   * @async
   * @memberof PacienteService
   * @param {Object} paciente - El objeto del paciente.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El paciente actualizado.
   */
  static async updatePacienteByUserId(paciente, conn = dbConn) {
    return await PacienteModel.updatePaciente(paciente, conn);
  }

  /**
   * @method deletePacienteByUserId
   * @description Método para eliminar un paciente por su ID de usuario.
   * @static
   * @async
   * @memberof PacienteService
   * @param {number} usuario_id - El ID de usuario del paciente.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   */
  static async deletePacienteByUserId(usuario_id, conn = dbConn) {
    return await PacienteModel.deletePacienteByUserId(usuario_id, conn);
  }
}

// Exportación del servicio
module.exports = PacienteService;