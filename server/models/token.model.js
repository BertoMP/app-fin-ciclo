/**
 * @class TokenModel
 * @description Clase que contiene los métodos para interactuar con la tabla de token.
 */
class TokenModel {
  /**
   * @method create
   * @description Método para crear un nuevo token.
   * @static
   * @async
   * @memberof TokenModel
   * @param {number} idUser - El ID del usuario.
   * @param {string} token - El token de reseteo.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de inserción.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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

  /**
   * @method deleteTokensByUserId
   * @description Método para eliminar todos los tokens de un usuario.
   * @static
   * @async
   * @memberof TokenModel
   * @param {number} idUser - El ID del usuario.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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
      throw new Error('Error al eliminar el token.');
    }
  }
}

// Exportación del modelo
module.exports = TokenModel;