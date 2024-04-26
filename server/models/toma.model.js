class TomaModel {
    static async createToma(dbConn, prescripcion) {
        const dosis = prescripcion.dosis;
        const hora = prescripcion.hora;
        const fecha_inicio = prescripcion.fecha_inicio;
        const fecha_fin = prescripcion.fecha_fin??null;
        const observaciones = prescripcion.observaciones??null;

        const query =
            'INSERT INTO toma (dosis, hora, fecha_inicio, fecha_fin, observaciones) VALUES (?, ?, ?, ?, ?)';

        try {
            const result = await dbConn.execute(query, [dosis, hora, fecha_inicio, fecha_fin, observaciones]);

            return result[0].insertId;
        } catch (err) {
            throw new Error('Error al guardar la toma.');
        }
    }
}

module.exports = TomaModel;