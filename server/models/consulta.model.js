class ConsultaModel {
    static async findAll(dbConn, page) {
        const limit = 10;
        const offset = ((page - 1) * limit);

        const query =
            'SELECT consulta.id, consulta.nombre, especialidad.nombre AS nombre_especialidad, ' +
            '       usuario.nombre AS nombre_usuario, usuario.primer_apellido, ' +
            '       usuario.segundo_apellido ' +
            'FROM consulta ' +
            'LEFT JOIN especialista ON consulta.id = especialista.consulta_id ' +
            'LEFT JOIN usuario ON especialista.usuario_id = usuario.id ' +
            'LEFT JOIN especialidad ON especialista.especialidad_id = especialidad.id ' +
            'ORDER BY consulta.id ASC ' +
            'LIMIT ? OFFSET ?';

        try {
            const [rows] = await dbConn.execute(query, [`${limit}`, `${offset}`]);
            const [count] = await dbConn.execute('SELECT COUNT(*) AS count FROM consulta');
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            const consultas = {};
            rows.forEach(row => {
                if (!consultas[row.id]) {
                    consultas[row.id] = {
                        id: row.id,
                        nombre: row.nombre,
                        medicos_asociados: []
                    };
                }

                if (row.nombre_usuario) {
                    consultas[row.id].medicos_asociados.push({
                        nombre: row.nombre_usuario,
                        primer_apellido: row.primer_apellido,
                        segundo_apellido: row.segundo_apellido,
                        especialidad: row.nombre_especialidad
                    });
                }
            });

            return {rows: Object.values(consultas), total, actualPage, totalPages};
        } catch (err) {
            throw new Error('Error al obtener las consultas.');
        }
    }

    static async findById(dbConn, id) {
        const query =
            'SELECT consulta.id, consulta.nombre, especialidad.nombre AS nombre_especialidad, ' +
            '       usuario.nombre AS nombre_usuario, usuario.primer_apellido, ' +
            '       usuario.segundo_apellido ' +
            'FROM consulta ' +
            'LEFT JOIN especialista ON consulta.id = especialista.consulta_id ' +
            'LEFT JOIN usuario ON especialista.usuario_id = usuario.id ' +
            'LEFT JOIN especialidad ON especialista.especialidad_id = especialidad.id ' +
            'WHERE consulta.id = ?';

        try {
            const [rows] = await dbConn.execute(query, [id]);

            const consulta = {
                id: rows[0].id,
                nombre: rows[0].nombre,
                medicos_asociados: []
            };

            rows.forEach(row => {
                consulta.medicos_asociados.push({
                    nombre: row.nombre_usuario,
                    primer_apellido: row.primer_apellido,
                    segundo_apellido: row.segundo_apellido,
                    especialidad: row.nombre_especialidad
                });
            });

            return consulta;
        } catch (err) {
            throw new Error('Error al obtener la consulta.');
        }
    }

    static async findByName(dbConn, nombre) {
        const query =
            'SELECT * FROM consulta ' +
            'WHERE nombre = ?';

        try {
            const [rows] = await dbConn.execute(query, [nombre]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener la consulta.');
        }
    }

    static async create(dbConn, consulta) {
        const nombre = consulta.nombre;

        const query =
            'INSERT INTO consulta (nombre) ' +
            'VALUES (?)';

        try {
            await dbConn.execute(query, [nombre]);
        } catch (err) {
            throw new Error('Error al crear la consulta.');
        }
    }

    static async update(dbConn, id, consulta) {
        const nombre = consulta.nombre;

        const query =
            'UPDATE consulta ' +
            'SET nombre = ? ' +
            'WHERE id = ?';

        try {
            await dbConn.execute(query, [nombre, id]);
        } catch (err) {
            throw new Error('Error al actualizar la consulta.');
        }
    }

    static async delete(dbConn, id) {
        const query =
            'DELETE FROM consulta ' +
            'WHERE id = ?';

        try {
            await dbConn.execute(query, [id]);
        } catch (err) {
            throw new Error('Error al eliminar la consulta.');
        }
    }


}

module.exports = ConsultaModel;