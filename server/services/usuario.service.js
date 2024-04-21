const dbConn = require('../util/database/database');
const UsuarioModel = require('../models/usuario.model');
const PacienteModel = require('../models/paciente.model');
const EspecialistaModel = require('../models/especialista.model');
const TokenModel = require('../models/token.model');
const PacienteMedicamentoModel = require('../models/pacienteMedicamento.model');
const TensionArterialModel = require('../models/tensionArterial.model');
const GlucometriaModel = require('../models/glucometria.model');
const InformeModel = require('../models/informe.model');
const CitaModel = require('../models/cita.model');

class UsuarioService {
    static async readAllUsuarios(searchValues) {
        return await UsuarioModel.fetchAll(dbConn, searchValues);
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
            throw new Error('Error al crear el usuario o el paciente.');
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
            throw new Error('Error al crear el usuario o el especialista.');
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
            throw new Error('Error al actualizar el usuario o el paciente.');
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
            throw new Error('Error al actualizar el usuario o el especialista.');
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

            await PacienteMedicamentoModel.deleteMedicamentosByUserId(conn, id);

            await TensionArterialModel.deleteTensionesArterialesByUserId(conn, id);

            await GlucometriaModel.deleteGlucometriasByUserId(conn, id);

            const idInformes = await CitaModel.getInformesByUserId(conn, id);

            await CitaModel.deleteCitasByUserId(conn, id);

            await InformeModel.deleteInformes(conn, idInformes);

            await PacienteModel.deletePacienteByUserId(conn, id);

            await UsuarioModel.delete(conn, id);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw new Error('Error al eliminar el usuario.');
        } finally {
            conn.release();
        }
    }

    static async updateRefreshToken(email, refreshToken) {
        return await UsuarioModel.updateRefreshToken(dbConn, email, refreshToken);
    }

    static async readUsuarioById(id) {
        return await UsuarioModel.findById(dbConn, id);
    }
}

module.exports = UsuarioService;