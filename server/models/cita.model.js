class CitaModel {
    static async fetchAll(dbConn, page, paciente_id) {
        const limit = 10;
        const offset = ((page - 1) * limit);

        const query =
            'SELECT ' +
            '   cita.id, ' +
            '   cita.fecha, ' +
            '   cita.hora, ' +
            '   cita.informe_id, ' +
            '   especialista_user.nombre AS especialista_nombre, ' +
            '   especialista_user.primer_apellido AS especialista_primer_apellido, ' +
            '   especialista_user.segundo_apellido AS especialista_segundo_apellido, ' +
            '   especialidad.nombre AS especialidad_nombre' +
            '   consulta.nombre AS consulta_nombre' +
            'FROM ' +
            '   cita ' +
            'INNER JOIN ' +
            '   paciente ON cita.paciente_id = pacente.id ' +
            'INNER JOIN ' +
            '   especialista ON cita.especialista_id = especialista.id ' +
            'INNER JOIN ' +
            '   usuario AS especialista_user ON especialista.usuario_id = especialista_user.id ' +
            'INNER JOIN ' +
            '   especialidad ON especialista.especialidad_id = especialidad.id ' +
            'INNER JOIN ' +
            '   consulta ON cita.consulta_id = consulta.id ' +
            'WHERE ' +
            '   cita.paciente_id = ? ' +
            'ORDER BY ' +
            '   cita.fecha DESC, ' +
            '   cita.hora DESC ' +
            'LIMIT ? OFFSET ?';

        try {
            const [rows] =
                await dbConn.execute(query, [paciente_id, `${limit}`, `${offset}`]);
            const [count] =
                await dbConn.execute(
                    'SELECT COUNT(*) AS count FROM cita WHERE paciente_id = ?',
                    [paciente_id]
                );
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            return { rows, total, actualPage, totalPages };
        } catch (err) {
            throw new Error('No se pudieron obtener las citas.');
        }
    }

    static async fetchById(dbConn, id) {
        const query =
            'SELECT ' +
            '   cita.id, ' +
            '   cita.fecha, ' +
            '   cita.hora, ' +
            '   cita.informe_id, ' +
            '   especialista_user.nombre AS especialista_nombre, ' +
            '   especialista_user.primer_apellido AS especialista_primer_apellido, ' +
            '   especialista_user.segundo_apellido AS especialista_segundo_apellido, ' +
            '   paciente_user.nombre AS paciente_nombre, ' +
            '   paciente_user.primer_apellido AS paciente_primer_apellido, ' +
            '   paciente_user.segundo_apellido AS paciente_segundo_apellido, ' +
            '   especialidad.nombre AS especialidad_nombre' +
            '   consulta.nombre AS consulta_nombre' +
            'FROM ' +
            '   cita ' +
            'INNER JOIN ' +
            '   especialista ON cita.especialista_id = especialista.id ' +
            'INNER JOIN ' +
            '   usuario AS especialista_user ON especialista.usuario_id = especialista_user.id ' +
            'INNER JOIN ' +
            '   paciente ON cita.paciente_id = paciente.id ' +
            'INNER JOIN ' +
            '   usuario AS paciente_user ON paciente.usuario_id = paciente_user.id ' +
            'INNER JOIN ' +
            '   especialidad ON especialista.especialidad_id = especialidad.id ' +
            'INNER JOIN ' +
            '   consulta ON cita.consulta_id = consulta.id ' +
            'WHERE ' +
            '   cita.id = ?';

        try {
            const [rows] = await dbConn.execute(query, [id]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener la cita.');
        }
    }

    static async fetchByData(dbConn, data) {
        const query =
            'SELECT * ' +
            'FROM cita ' +
            'WHERE ' +
            '   fecha = ? ' +
            '   AND hora = ? ' +
            '   AND especialista_id = ? ';

        try {
            const [rows] = await dbConn.execute(query, [data.fecha, data.hora, data.especialista_id]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener la cita.');
        }
    }

    static async fetchAgenda(dbConn, especialista_id) {
        const query =
            'SELECT ' +
            '   cita.id, ' +
            '   cita.fecha, ' +
            '   cita.hora, ' +
            '   cita.informe_id, ' +
            '   paciente_user.id AS paciente_id,' +
            '   paciente_user.nombre AS paciente_nombre, ' +
            '   paciente_user.primer_apellido AS paciente_primer_apellido, ' +
            '   paciente_user.segundo_apellido AS paciente_segundo_apellido ' +
            'FROM ' +
            '   cita ' +
            'INNER JOIN ' +
            '   paciente ON cita.paciente_id = paciente.id ' +
            'WHERE ' +
            '   especialista_id = ? ' +
            '   AND fecha = CURDATE() ';

        try {
            const [rows] = await dbConn.execute(query, [especialista_id]);
            return rows;
        } catch (err) {
            throw new Error('Error al obtener la agenda.');
        }
    }

    static async createCita(dbConn, cita) {
        const fecha = cita.fecha;
        const hora = cita.hora;
        const paciente_id = cita.paciente_id;
        const especialista_id = cita.especialista_id;

        const query =
            'INSERT INTO cita ' +
            '(fecha, hora, paciente_id, especialista_id) ' +
            'VALUES (?, ?, ?, ?)';

        try {
            await dbConn.execute(query, [fecha, hora, paciente_id, especialista_id, consulta_id]);
        } catch (err) {
            throw new Error('Error al crear la cita.');
        }
    }

    static async deleteCita(dbConn, id) {
        const query =
            'DELETE FROM cita ' +
            'WHERE id = ?';

        try {
            await dbConn.execute(query, [id]);
        } catch (err) {
            throw new Error('Error al eliminar la cita.');
        }
    }
}

module.exports = CitaModel;