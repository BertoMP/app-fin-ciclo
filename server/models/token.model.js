class TokenModel {
    static async create(dbConn, idUser, token) {
        const query =
            'INSERT INTO token (usuario_id, reset_token) ' +
            '   VALUES (?, ?)';

        try {
            await dbConn.query(query, [idUser, token]);
        } catch (err) {
            throw new Error('Error al crear el token.');
        }
    }

    static async deleteTokensByUserId(dbConn, idUser) {
        const query =
            'DELETE ' +
            'FROM ' +
            '   token ' +
            'WHERE ' +
            '   usuario_id = ?';

        try {
            await dbConn.query(query, [idUser]);
        } catch (err) {
            throw new Error('Error al eliminar el token.');
        }
    }
}

module.exports = TokenModel;