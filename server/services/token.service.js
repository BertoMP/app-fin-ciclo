const dbConn = require('../util/functions/database');
const TokenModel = require('../models/token.model');

class TokenService {
    static async createToken(idUser, token) {
        return await TokenModel.create(dbConn, idUser, token);
    }
}

module.exports = TokenService