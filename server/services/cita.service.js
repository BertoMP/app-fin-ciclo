const dbConn = require('../util/database/database');
const CitaModel = require('../models/cita.model');
const UsuarioService = require('./usuario.service');
const PdfService = require('./pdf.service');
const EmailService = require('./email.service');
const qrcode = require('../util/functions/createQr');

class CitaService {
  static async readCitas(searchValues, limit, conn = dbConn) {
    return await CitaModel.fetchAll(searchValues, limit, conn);
  }

  static async readInformesByUserId(paciente_id, conn = dbConn) {
    return await CitaModel.getInformesByUserId(paciente_id, conn);
  }

  static async readCitaById(id, conn = dbConn) {
    return await CitaModel.fetchById(id, conn);
  }

  static async readCitaByData(cita, conn = dbConn) {
    return await CitaModel.fetchByData(cita, conn);
  }

  static async readCitasAgenda(especialista_id, conn = dbConn) {
    return await CitaModel.fetchAgenda(especialista_id, conn);
  }

  static async readPacienteIdByInformeId(informe_id, conn = dbConn) {
    return await CitaModel.fetchPacienteIdByInformeId(informe_id, conn);
  }

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

  static async deleteCitasByUserId(userId, conn = dbConn) {
    return await CitaModel.deleteCitasByUserId(userId, conn);
  }

  static async deleteCita(id, conn = dbConn) {
    return await CitaModel.deleteCita(id, conn);
  }

  static async updateInformeId(cita_id, informe_id, conn = dbConn) {
    return await CitaModel.updateInformeId(cita_id, informe_id, conn);
  }
}

module.exports = CitaService;
