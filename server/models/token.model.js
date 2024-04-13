class TokenModel {
    static async create(dbConn, idUser, token) {
        const query = 'INSERT INTO token (usuario_id, reset_token) VALUES (?, ?)';

        try {
            await dbConn.query(query, [idUser, token]);
        } catch (err) {
            console.log(err);
            throw new Error('Error al crear el token.');
        }
    }
}

module.exports = TokenModel;