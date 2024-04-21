const { format } = require('date-fns');

class CitaModel {
    static async fetchAll(dbConn, searchValues) {
        const page = searchValues.page;
        const paciente_id = searchValues.paciente_id;
        const fechaInicio = searchValues.fechaInicio;
        const fechaFin = searchValues.fechaFin;

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
            '   especialidad.nombre AS especialidad_nombre, ' +
            '   consulta.nombre AS consulta_nombre, ' +
            '   paciente_user.nombre AS paciente_nombre, ' +
            '   paciente_user.primer_apellido AS paciente_primer_apellido, ' +
            '   paciente_user.segundo_apellido AS paciente_segundo_apellido ' +
            'FROM ' +
            '   cita ' +
            'INNER JOIN ' +
            '   paciente ON cita.paciente_id = paciente.usuario_id ' +
            'INNER JOIN ' +
            '   especialista ON cita.especialista_id = especialista.usuario_id ' +
            'INNER JOIN ' +
            '   usuario AS especialista_user ON especialista.usuario_id = especialista_user.id ' +
            'INNER JOIN ' +
            '   usuario AS paciente_user ON paciente.usuario_id = paciente_user.id ' +
            'INNER JOIN ' +
            '   especialidad ON especialista.especialidad_id = especialidad.id ' +
            'INNER JOIN ' +
            '   consulta ON especialista.consulta_id = consulta.id ' +
            'WHERE ' +
            '   cita.paciente_id = ? ' +
            '   AND cita.fecha BETWEEN ? AND ? ' +
            'ORDER BY ' +
            '   cita.fecha DESC, ' +
            '   cita.hora DESC ' +
            'LIMIT ? OFFSET ?';

        try {
            const [rows] =
                await dbConn.execute(query, [paciente_id, fechaInicio, fechaFin, `${limit}`, `${offset}`]);
            const [count] =
                await dbConn.execute(
                    'SELECT COUNT(*) AS count FROM cita ' +
                    'WHERE paciente_id = ? ' +
                    'AND fecha BETWEEN ? AND ?',
                    [paciente_id, fechaInicio, fechaFin]
                );
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            const formattedRows = rows.reduce((acumulador, cita) => {
                const fecha = format(new Date(cita.fecha), 'dd-MM-yyyy');

                if (!acumulador.datos_paciente) {
                    acumulador.datos_paciente = {
                        paciente_id: cita.paciente_id,
                        nombre: cita.paciente_nombre,
                        primer_apellido: cita.paciente_primer_apellido,
                        segundo_apellido: cita.paciente_segundo_apellido
                    };
                }

                acumulador.citas.push({
                    datos_especialista: {
                        nombre: cita.especialista_nombre,
                        primer_apellido: cita.especialista_primer_apellido,
                        segundo_apellido: cita.especialista_segundo_apellido,
                        especialidad_nombre: cita.especialidad_nombre
                    },
                    datos_cita: {
                        fecha: fecha,
                        hora: cita.hora,
                        consulta_nombre: cita.consulta_nombre
                    }
                });

                return acumulador;
            }, { datos_paciente: null, citas: [] });

            return { rows: [formattedRows], total, actualPage, totalPages };
        } catch (err) {
            console.log(err);
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
            '   cita.paciente_id AS paciente_id, ' +
            '   especialista_user.nombre AS especialista_nombre, ' +
            '   especialista_user.primer_apellido AS especialista_primer_apellido, ' +
            '   especialista_user.segundo_apellido AS especialista_segundo_apellido, ' +
            '   paciente_user.nombre AS paciente_nombre, ' +
            '   paciente_user.primer_apellido AS paciente_primer_apellido, ' +
            '   paciente_user.segundo_apellido AS paciente_segundo_apellido, ' +
            '   especialidad.nombre AS especialidad_nombre, ' +
            '   consulta.nombre AS consulta_nombre ' +
            'FROM ' +
            '   cita ' +
            'INNER JOIN ' +
            '   especialista ON cita.especialista_id = especialista.usuario_id ' +
            'INNER JOIN ' +
            '   usuario AS especialista_user ON especialista.usuario_id = especialista_user.id ' +
            'INNER JOIN ' +
            '   paciente ON cita.paciente_id = paciente.usuario_id ' +
            'INNER JOIN ' +
            '   usuario AS paciente_user ON paciente.usuario_id = paciente_user.id ' +
            'INNER JOIN ' +
            '   especialidad ON especialista.especialidad_id = especialidad.id ' +
            'INNER JOIN ' +
            '   consulta ON especialista.consulta_id = consulta.id ' +
            'WHERE ' +
            '   cita.id = ?';

        try {
            const [rows] = await dbConn.execute(query, [id]);
            const cita = rows[0];

            if (cita) {
                const fecha = format(new Date(cita.fecha), 'dd-MM-yyyy');

                return {
                    datos_paciente: {
                        paciente_id: cita.paciente_id,
                        nombre: cita.paciente_nombre,
                        primer_apellido: cita.paciente_primer_apellido,
                        segundo_apellido: cita.paciente_segundo_apellido
                    },
                    datos_especialista: {
                        nombre: cita.especialista_nombre,
                        primer_apellido: cita.especialista_primer_apellido,
                        segundo_apellido: cita.especialista_segundo_apellido,
                        especialidad_nombre: cita.especialidad_nombre
                    },
                    datos_cita: {
                        fecha: fecha,
                        hora: cita.hora,
                        consulta_nombre: cita.consulta_nombre
                    }
                };
            }

            return cita;
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
            '   paciente_user.num_historia_clinica AS paciente_historia_clinica, ' +
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

        const queryId =
            'SELECT id ' +
            'FROM cita ' +
            'WHERE fecha = ? AND hora = ? AND paciente_id = ? AND especialista_id = ? ' +
            'ORDER BY id DESC LIMIT 1';

        try {
            await dbConn.execute(query, [fecha, hora, paciente_id, especialista_id]);

            const [rows] = await dbConn.execute(queryId, [fecha, hora, paciente_id, especialista_id]);
            return rows[0].id;
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

    static async getInformesByUserId(dbConn, paciente_id) {
        const query =
            'SELECT informe_id ' +
            'FROM cita ' +
            'WHERE paciente_id = ?';

        try {
            const [rows] = await dbConn.execute(query, [paciente_id]);
            return rows.map(row => row.informe_id);
        } catch (err) {
            throw new Error('Error al obtener los informes.');
        }
    }

    static async deleteCitasByUserId(dbConn, paciente_id) {
        const query =
            'DELETE FROM cita WHERE paciente_id = ?';

        try {
            await dbConn.execute(query, [paciente_id]);
        } catch (err) {
            throw new Error('Error al eliminar las citas.');
        }
    }
}

module.exports = CitaModel;