const bcrypt = require('bcryptjs');
const dbConn = require('../util/database');
const UserModel = require('../models/user.model');

class UserService {
    static async createUser(email, password) {
        const exists = await UserModel.findByEmail(dbConn, email);
        const usuarios = exists[0];

        if (usuarios.length > 0) {
            throw new Error('El email ya se encuentra en uso.');
        }

        const encryptedPassword = await bcrypt.hash(password, 12);

        await UserModel.saveUser(dbConn, email, encryptedPassword);
    }

    static async readUser(email) {
        const dbResult = await UserModel.findByEmail(dbConn, email);

        return dbResult[0][0];
    }

    static async readAllUsers() {
        const dbResult = await UserModel.fetchAll(dbConn);

        return dbResult[0];
    }

    static async updateUser(email, password) {
        const encryptedPassword = await bcrypt.hash(password, 12);

        await UserModel.updateUser(dbConn, email, encryptedPassword);
    }

    static async deleteUser(email) {
        await UserModel.deleteUser(dbConn, email);
    }
}

module.exports = UserService;
