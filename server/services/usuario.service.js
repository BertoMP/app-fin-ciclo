const dbConn = require('../util/database/database');
const UsuarioModel = require('../models/usuario.model');

const PacienteService = require('./paciente.service');
const EspecialistaService = require('./especialista.service');
const TokenService = require('./token.service');
const TensionArterialService = require('./tensionArterial.service');
const InformeService = require('./informe.service');
const PacienteTomaMedicamentoService = require('./pacienteTomaMedicamento.service');
const GlucometriaService = require('./glucometria.service');
const InformePatologiaService = require('./informePatologia.service');

class UsuarioService {
  static async readAllUsuarios(searchValues, limit, conn = dbConn) {
    return await UsuarioModel.fetchAll(searchValues, limit, conn);
  }

  static async readUsuarioPaciente(id, conn = dbConn) {
    return await UsuarioModel.findPacienteById(id, conn);
  }

  static async readUsuarioEspecialista(id, conn = dbConn) {
    return await UsuarioModel.findEspecialistaById(id, conn);
  }

  static async readUsuarioRoleById(id, conn = dbConn) {
    return await UsuarioModel.findRoleById(id, conn);
  }

  static async createUsuarioPaciente(usuario, paciente, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      paciente.usuario_id = await UsuarioModel.create(conn, usuario);

      await PacienteService.createPaciente(paciente, conn);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async createUsuarioEspecialista(usuario, especialista, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      especialista.usuario_id = await UsuarioModel.create(conn, usuario);

      await EspecialistaService.create(conn, especialista);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async updateUsuarioPaciente(usuario, paciente, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      await UsuarioModel.update(conn, usuario);

      await PacienteService.update(paciente, conn);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async updateUsuarioEspecialista(usuario, especialista, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      await UsuarioModel.update(conn, usuario);

      await EspecialistaService.update(especialista, conn);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async readEmailByUserId(id, conn = dbConn) {
    return await UsuarioModel.getEmailById(id, conn);
  }

  static async readUsuarioByEmail(email, conn = dbConn) {
    return await UsuarioModel.findByEmail(email, conn);
  }

  static async readUsuarioByDNI(dni, conn = dbConn) {
    return await UsuarioModel.findByDNI(dni, conn);
  }

  static async updatePassword(email, password, conn = dbConn) {
    return await UsuarioModel.updatePassword(email, password, conn);
  }

  static async deleteUsuario(id, conn = null) {
    const CitaService = require('./cita.service'); // Se importa aquí para evitar un ciclo de dependencias
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      await TokenService.deteleToken(id, conn);

      const idsTomas = await PacienteTomaMedicamentoService.readTomasByUserId(id, conn);

      for (const idToma of idsTomas) {
        await PacienteTomaMedicamentoService.deleteToma(idToma, conn);
      }

      await TensionArterialService.deleteTensionArterialByUserId(id, conn);

      await GlucometriaService.deleteGlucometriaByUserId(id, conn);

      const idInformes = await CitaService.readInformesByUserId(id, conn);

      await CitaService.deleteCitasByUserId(id, conn);

      for (const idInforme of idInformes) {
        await InformePatologiaService.deletePatologiaByInformeId(idInforme, conn);
        await InformeService.deleteInforme(idInforme, conn);
      }

      await PacienteService.deletePacienteByUserId(id, conn);

      await UsuarioModel.delete(conn, id);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async updateRefreshToken(userId, refreshToken, conn = dbConn) {
    return await UsuarioModel.updateRefreshToken(userId, refreshToken, conn);
  }

  static async readUsuarioById(id, conn = dbConn) {
    return await UsuarioModel.findById(id, conn);
  }
}

module.exports = UsuarioService;