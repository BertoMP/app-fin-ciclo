class TensionArterialModel {
    static async fetchAll(dbConn, searchValues) {
        const page = searchValues.page;
        const fechaInicio = searchValues.fechaInicio;
        const fechaFin = searchValues.fechaFin;
        const paciente_id = searchValues.paciente_id;

        const limit = 10;
        const offset = (page - 1) * limit;

        const query =
            'SELECT fecha, hora, sistolica, diastolica, pulsaciones_minuto FROM tension_arterial ' +
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
                    'SELECT COUNT(*) AS count FROM tension_arterial ' +
                    'WHERE fecha BETWEEN ? AND ? ' +
                    'AND paciente_id = ?',
                    [fechaInicio, fechaFin, paciente_id]
                );
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            return { rows, total, actualPage, totalPages };
        } catch (err) {
            throw new Error('No se pudieron obtener las mediciones de tensión arterial.');
        }
    }

    static async create(dbConn, tensionArterial) {
        const paciente_id = tensionArterial.paciente_id;
        const fecha = tensionArterial.fecha;
        const hora = tensionArterial.hora;
        const sistolica = tensionArterial.sistolica;
        const diastolica = tensionArterial.diastolica;
        const pulsaciones_minuto = tensionArterial.pulsaciones;

        const query =
            'INSERT INTO tension_arterial (paciente_id, fecha, hora, sistolica, diastolica, pulsaciones_minuto) ' +
            'VALUES (?, ?, ?, ?, ?, ?)';

        try {
            await dbConn.execute(query, [paciente_id, fecha, hora, sistolica, diastolica, pulsaciones_minuto]);
        } catch (err) {
            throw new Error('No se pudo crear la medición de tensión arterial.');
        }
    }
}

module.exports = TensionArterialModel;