const dbConn = require('../util/database/database');
const TokenModel = require('../models/token.model');

class TokenService {
  static async createToken(idUser, token, conn = dbConn) {
    return await TokenModel.create(idUser, token, conn);
  }

  static async deteleToken(idUser, conn = dbConn) {
    return await TokenModel.deleteTokensByUserId(idUser, conn);
  }
}

module.exports = TokenService