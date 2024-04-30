class TokenModel {
  static async create(idUser, token, dbConn) {
    const query =
      'INSERT INTO token (usuario_id, reset_token) ' +
      '   VALUES (?, ?)';

    try {
      return await dbConn.execute(query, [idUser, token]);
    } catch (err) {
      throw new Error('Error al crear el token.');
    }
  }

  static async deleteTokensByUserId(idUser, dbConn) {
    const query =
      'DELETE ' +
      'FROM ' +
      '   token ' +
      'WHERE ' +
      '   usuario_id = ?';

    try {
      return await dbConn.execute(query, [idUser]);
    } catch (err) {
      console.log(err);
      throw new Error('Error al eliminar el token.');
    }
  }
}

module.exports = TokenModel;