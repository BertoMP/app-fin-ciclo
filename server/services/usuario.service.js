const dbConn = require('../util/database');
const UsuarioModel = require('../models/usuario.model');

class UsuarioService {
   static async readUsuarioByEmail(email) {
       return await UsuarioModel.findByEmail(dbConn, email);
   }

    static async createUsuario(email, password) {
         return await UsuarioModel.create(dbConn, email, password);
    }

    static async updatePassword(email, password) {
        return await UsuarioModel.updatePassword(dbConn, email, password);
    }
}

module.exports = UsuarioService;