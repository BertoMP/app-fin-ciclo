class CodigoPostalMunicipioModel {
    static async findByMunicipioId(dbConn, cod_municipio) {
        const query =
            'SELECT ' +
            '   codigo_postal_id ' +
            'FROM ' +
            '   codigo_postal_municipio ' +
            'WHERE ' +
            '   municipio_id = ?';

        cod_municipio = cod_municipio.toString().padStart(5, '0');

        try {
            const [rows] = await dbConn.query(query, [cod_municipio]);

            return rows;
        } catch (err) {
            throw new Error('Error al conseguir los códigos postales del municipio.');
        }
    }
}

module.exports = CodigoPostalMunicipioModel;