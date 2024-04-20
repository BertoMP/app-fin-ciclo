class InformeModel {
    static async fetchById(dbConn, id) {
        const query =
            'SELECT' +
            '    informe.id AS informe_id,' +
            '    informe.motivo,' +
            '    informe.patologia,' +
            '    informe.contenido,' +
            '    cita.fecha,' +
            '    cita.hora,' +
            '    paciente.usuario_id AS paciente_id,' +
            '    paciente.num_historia_clinica,' +
            '    usuario_paciente.nombre AS paciente_nombre,' +
            '    usuario_paciente.primer_apellido AS paciente_primer_apellido' +
            '    usuario_paciente.segundo_apellido AS paciente_segundo_apellido,' +
            '    especialista.usuario_id AS especialista_id,' +
            '    especialista.num_colegiado,' +
            '    especialidad.nombre,' +
            '    usuario_especialista.nombre AS especialista_nombre' +
            '    usuario_especialista.primer_apellido AS especialista_primer_apellido' +
            '    usuario_especialista.segundo_apellido AS especialista_segundo_apellido' +
            'FROM' +
            '    informe' +
            'INNER JOIN' +
            '    cita ON informe.id = cita.informe_id' +
            'INNER JOIN' +
            '    paciente ON cita.paciente_id = paciente.usuario_id' +
            'INNER JOIN' +
            '    usuario AS usuario_paciente ON paciente.usuario_id = usuario_paciente.id' +
            'INNER JOIN' +
            '    especialista ON cita.especialista_id = especialista.usuario_id' +
            'INNER JOIN' +
            '    usuario AS usuario_especialista ON especialista.usuario_id = usuario_especialista.id' +
            'INNER JOIN' +
            '    especialidad ON especialista.especialidad_id = especialidad.id' +
            'WHERE' +
            '    informe.id = ?';
        try {
            const [rows] = await dbConn.execute(query, [id]);
            const row = rows[0];

            return {
                datos_cita: {
                    fecha: row.fecha,
                    hora: row.hora,
                },
                datos_paciente: {
                    usuario_id: row.paciente_id,
                    num_historia_clinica: row.num_historia_clinica,
                    nombre: row.paciente_nombre,
                    primer_apellido: row.paciente_primer_apellido,
                    segundo_apellido: row.paciente_segundo_apellido,
                },
                datos_especialista: {
                    usuario_id: row.especialista_id,
                    num_colegiado: row.num_colegiado,
                    especialidad: row.especialidad.nombre,
                    nombre: row.especialista_nombre,
                    primer_apellido: row.especialista_primer_apellido,
                    segundo_apellido: row.especialista_segundo_apellido,
                },
                datos_informe: {
                    id: row.informe_id,
                    motivo: row.motivo,
                    patologia: row.patologia,
                    contenido: row.contenido,
                },
            };
        } catch (err) {
            throw new Error('Error al obtener el informe.');
        }
    }

    static async create(dbConn, informe) {
        const query =
            'INSERT INTO informes (titulo, contenido) ' +
            '   VALUES (?, ?)';

        try {
            await dbConn.execute(query, [informe.titulo, informe.contenido]);
        } catch (err) {
            throw new Error('Error al crear el informe.');
        }
    }

    static async deleteInformes(dbConn, ids) {
        const query =
            'DELETE FROM informe WHERE FIND_IN_SET(id, ?)';

        try {
            const idsString = ids.join(',');

            await dbConn.execute(query, [idsString]);
        } catch (err) {
            throw new Error('Error al eliminar el informe.');
        }
    }
}

module.exports = InformeModel;