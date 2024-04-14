const dbConn = require('../util/database/database');
const UsuarioModel = require('../models/usuario.model');
const PacienteModel = require('../models/paciente.model');
const EspecialistaModel = require('../models/especialista.model');

class UsuarioService {
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

    static async readUsuarioByEmail(email) {
       return await UsuarioModel.findByEmail(dbConn, email);
    }

    static async readUsuarioByDNI(dni) {
        return await UsuarioModel.findByDNI(dbConn, dni);
    }

    static async updatePassword(email, password) {
        return await UsuarioModel.updatePassword(dbConn, email, password);
    }
}

module.exports = UsuarioService;