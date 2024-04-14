class GlucometriaModel {
    static async fetchAll(dbConn, searchValues) {
        const page = searchValues.page;
        const fechaInicio = searchValues.fechaInicio;
        const fechaFin = searchValues.fechaFin;
        const paciente_id = searchValues.paciente_id;

        const limit = 10;
        const offset = (page - 1) * limit;

        const query =
            'SELECT fecha, hora, medicion FROM glucometria ' +
            'WHERE fecha BETWEEN ? AND ? ' +
            'AND paciente_id = ? ' +
            'ORDER BY fecha DESC, hora DESC ' +
            'LIMIT ? OFFSET ?';

        try {
            const [rows] =
                await dbConn.execute(query,
                    [fechaInicio, fechaFin, paciente_id, `${limit}`, `${offset}`]);
            const [count] =
                await dbConn.execute(
                    'SELECT COUNT(*) AS count FROM glucometria ' +
                    'WHERE fecha BETWEEN ? AND ? ' +
                    'AND paciente_id = ?',
                    [fechaInicio, fechaFin, paciente_id]
                );
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            return { rows, total, actualPage, totalPages };
        } catch (err) {
            throw new Error('No se pudieron obtener las mediciones de glucosa.');
        }
    }

    static async create(dbConn, glucometria) {
        const paciente_id = glucometria.paciente_id;
        const fecha = glucometria.fecha;
        const hora = glucometria.hora;
        const medicion = glucometria.medicion;

        const query =
            'INSERT INTO glucometria (paciente_id, fecha, hora, medicion) ' +
            'VALUES (?, ?, ?, ?)';

        try {
            await dbConn.execute(query, [paciente_id, fecha, hora, medicion]);
        } catch (err) {
            throw new Error('No se pudo crear la medición de glucosa.');
        }
    }
}

module.exports = GlucometriaModel;