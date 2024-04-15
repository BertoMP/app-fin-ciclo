class TipoViaModel {
    static async fetchAll(dbConn) {
        const query =
            'SELECT id as value, nombre as label FROM tipo_via ' +
            'ORDER BY nombre';

        try {
            const [rows] = await dbConn.execute(query);
            return rows;
        } catch (err) {
            throw new Error('Error al obtener los tipos de vía.');
        }
    }
}

module.exports = TipoViaModel;