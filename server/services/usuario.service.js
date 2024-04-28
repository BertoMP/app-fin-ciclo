const dbConn = require('../util/database/database');
const UsuarioModel = require('../models/usuario.model');
const PacienteModel = require('../models/paciente.model');
const EspecialistaModel = require('../models/especialista.model');
const TokenModel = require('../models/token.model');
const TensionArterialModel = require('../models/tensionArterial.model');
const GlucometriaModel = require('../models/glucometria.model');
const InformeModel = require('../models/informe.model');
const CitaModel = require('../models/cita.model');
const PacienteTomaMedicamentoModel = require('../models/pacienteTomaMedicamento.model');
const TomaModel = require('../models/toma.model');

class UsuarioService {
  static async readAllUsuarios(searchValues, limit) {
    return await UsuarioModel.fetchAll(dbConn, searchValues, limit);
  }

  static async readUsuarioPaciente(id) {
    return await UsuarioModel.findPacienteById(dbConn, id);
  }

  static async readUsuarioEspecialista(id) {
    return await UsuarioModel.findEspecialistaById(dbConn, id);
  }

  static async readUsuarioRoleById(id) {
    return await UsuarioModel.findRoleById(dbConn, id);
  }

  static async createUsuarioPaciente(usuario, paciente) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      paciente.usuario_id = await UsuarioModel.create(conn, usuario);

      await PacienteModel.create(conn, paciente);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    } finally {
      conn.release();
    }
  }

  static async createUsuarioEspecialista(usuario, especialista) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      especialista.usuario_id = await UsuarioModel.create(conn, usuario);

      await EspecialistaModel.create(conn, especialista);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    } finally {
      conn.release();
    }
  }

  static async updateUsuarioPaciente(usuario, paciente) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      await UsuarioModel.update(conn, usuario);

      await PacienteModel.update(conn, paciente);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    } finally {
      conn.release();
    }
  }

  static async updateUsuarioEspecialista(usuario, especialista) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      await UsuarioModel.update(conn, usuario);

      await EspecialistaModel.update(conn, especialista);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    } finally {
      conn.release();
    }
  }

  static async getEmailById(id) {
    return await UsuarioModel.getEmailById(dbConn, id);
  }

  static async readUsuarioByEmail(email) {
    return await UsuarioModel.findByEmail(dbConn, email);
  }

  static async readUsuarioByDNI(dni) {
    return await UsuarioModel.findByDNI(dbConn, dni);
  }

  static async updatePassword(email, password) {
    return await UsuarioModel.updatePassword(dbConn, email, password);
  }

  static async deleteUsuario(id) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      await TokenModel.deleteTokensByUserId(conn, id);

      const idsTomas = await PacienteTomaMedicamentoModel.findTomasByUserId(conn, id);

      for (const idToma of idsTomas) {
        await PacienteTomaMedicamentoModel.deleteToma(conn, idToma);
        await TomaModel.deleteToma(conn, idToma);
      }

      await TensionArterialModel.deleteTensionesArterialesByUserId(conn, id);

      await GlucometriaModel.deleteGlucometriasByUserId(conn, id);

      const idInformes = await CitaModel.getInformesByUserId(conn, id);

      await CitaModel.deleteCitasByUserId(conn, id);

      for (const idInforme of idInformes) {
        await InformeModel.deleteInforme(conn, idInforme);
      }

      await PacienteModel.deletePacienteByUserId(conn, id);

      await UsuarioModel.delete(conn, id);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    } finally {
      conn.release();
    }
  }

  static async updateRefreshToken(userId, refreshToken) {
    return await UsuarioModel.updateRefreshToken(dbConn, userId, refreshToken);
  }

  static async readUsuarioById(id) {
    return await UsuarioModel.findById(dbConn, id);
  }
}

module.exports = UsuarioService;