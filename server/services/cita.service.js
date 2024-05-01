// Importación del modelo asociado al servicio
const CitaModel       = require('../models/cita.model');

// Importación de servicios auxiliares
const UsuarioService  = require('./usuario.service');
const PdfService      = require('./pdf.service');
const EmailService    = require('./email.service');

// Importación de utilidades necesarias
const dbConn          = require('../util/database/database');
const qrcode          = require('../util/functions/createQr');

/**
 * @class CitaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Cita.
 */
class CitaService {
  /**
   * @method readCitas
   * @description Método para leer citas.
   * @static
   * @async
   * @memberOf CitaService
   * @param {Object} searchValues - Los valores de búsqueda.
   * @param {number} limit - El límite de resultados.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de citas.
   */
  static async readCitas(searchValues, limit, conn = dbConn) {
    return await CitaModel.fetchAll(searchValues, limit, conn);
  }

  /**
   * @method readInformesByUserId
   * @description Método para leer informes por el ID del paciente.
   * @static
   * @async
   * @memberOf CitaService
   * @param {number} paciente_id - El ID del paciente.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de informes.
   */
  static async readInformesByUserId(paciente_id, conn = dbConn) {
    return await CitaModel.getInformesByUserId(paciente_id, conn);
  }

  /**
   * @method readCitaById
   * @description Método para leer una cita por su ID.
   * @static
   * @async
   * @memberOf CitaService
   * @param {number} id - El ID de la cita.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la cita.
   */
  static async readCitaById(id, conn = dbConn) {
    return await CitaModel.fetchById(id, conn);
  }

  /**
   * @method readCitaByData
   * @description Método para leer una cita por sus datos.
   * @static
   * @async
   * @memberOf CitaService
   * @param {Object} cita - Los datos de la cita.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la cita.
   */
  static async readCitaByData(cita, conn = dbConn) {
    return await CitaModel.fetchByData(cita, conn);
  }

  /**
   * @method readCitasAgenda
   * @description Método para leer las citas de la agenda de un especialista.
   * @static
   * @async
   * @memberOf CitaService
   * @param {number} especialista_id - El ID del especialista.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de citas.
   */
  static async readCitasAgenda(especialista_id, conn = dbConn) {
    return await CitaModel.fetchAgenda(especialista_id, conn);
  }

  /**
   * @method readPacienteIdByInformeId
   * @description Método para leer el ID del paciente por el ID del informe.
   * @static
   * @async
   * @memberOf CitaService
   * @param {number} informe_id - El ID del informe.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<number>} El ID del paciente.
   */
  static async readPacienteIdByInformeId(informe_id, conn = dbConn) {
    return await CitaModel.fetchPacienteIdByInformeId(informe_id, conn);
  }

  /**
   * @method createCita
   * @description Método para crear una cita.
   * @static
   * @async
   * @memberOf CitaService
   * @param {Object} cita - Los datos de la cita.
   * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
   * @returns {Promise<Object>} Un objeto que representa la consulta creada.
   * @throws {Error} Si ocurre algún error durante el proceso, lanza un error.
   */
  static async createCita(cita, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    let pdf;

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      const idCita = await CitaModel.createCita(cita, conn);
      const newCita = await CitaModel.fetchById(idCita, conn);
      const qr = await qrcode.generateQRCode(newCita);
      const emailPaciente = await UsuarioService.readEmailByUserId(cita.paciente_id, conn);
      pdf = await PdfService.generateCitaPDF(newCita, qr);
      await EmailService.sendPdfCita(newCita, emailPaciente, pdf);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }

      throw err;
    } finally {
      if (pdf) {
        await PdfService.destroyPDF(pdf);
      }

      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  /**
   * @method deleteCitasByUserId
   * @description Método para eliminar citas por el ID del usuario.
   * @static
   * @async
   * @memberOf CitaService
   * @param {number} userId - El ID del usuario.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa las citas eliminadas.
   */
  static async deleteCitasByUserId(userId, conn = dbConn) {
    return await CitaModel.deleteCitasByUserId(userId, conn);
  }

  /**
   * @method deleteCita
   * @description Método para eliminar una cita por su ID.
   * @static
   * @async
   * @memberOf CitaService
   * @param {number} id - El ID de la cita.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa la cita eliminada.
   */
  static async deleteCita(id, conn = dbConn) {
    return await CitaModel.deleteCita(id, conn);
  }

  /**
   * @method updateInformeId
   * @description Método para actualizar el ID del informe de una cita.
   * @static
   * @async
   * @memberOf CitaService
   * @param {number} cita_id - El ID de la cita.
   * @param {number} informe_id - El nuevo ID del informe.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<void>} Un objeto que representa el informe actualizado.
   */
  static async updateInformeId(cita_id, informe_id, conn = dbConn) {
    return await CitaModel.updateInformeId(cita_id, informe_id, conn);
  }
}

// Exportación del servicio
module.exports = CitaService;
