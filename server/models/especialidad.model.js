class EspecialidadModel {
    static async fetchAll(dbConn, page, limit) {
        const offset = ((page - 1) * limit);

        const query =
            'SELECT ' +
            '    id, ' +
            '    nombre, ' +
            '    descripcion, ' +
            '    imagen ' +
            'FROM ' +
            '   especialidad ' +
            'ORDER BY ' +
            '   id ASC ' +
            'LIMIT ? OFFSET ?';

        try {
            const [rows] =
                await dbConn.execute(query, [`${limit}`, `${offset}`]);
            const [count] =
                await dbConn.execute(
                    'SELECT ' +
                    '   COUNT(*) AS count ' +
                    'FROM ' +
                    '   especialidad'
                );
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            return { rows, total, actualPage, totalPages };
        } catch (err) {
            throw new Error('Error al obtener las especialidades.');
        }
    }

    static async fetchAllEspecialidadesEspecialistas(dbConn) {
        const query =
            'SELECT' +
            '    especialidad.id AS especialidad_id,' +
            '    especialidad.nombre AS especialidad_nombre,' +
            '    usuario.id AS usuario_id,' +
            '    usuario.nombre AS especialista_nombre,' +
            '    usuario.primer_apellido ,' +
            '    usuario.segundo_apellido ,' +
            '    especialista.imagen ' +
            'FROM' +
            '    especialidad ' +
            'INNER JOIN' +
            '    especialista ON especialidad.id = especialista.especialidad_id ' +
            'INNER JOIN' +
            '    usuario ON especialista.usuario_id = usuario.id ' +
            'WHERE' +
            '    especialista.turno <> ? ' +
            'ORDER BY' +
            '    especialidad.id ASC, ' +
            '    usuario.id ASC';

        try {
            const [rows] = await dbConn.execute(query, ['no-trabajando']);
            const especialidades = [];
            let currentEspecialidad = null;

            rows.forEach(row => {
                if (!currentEspecialidad || currentEspecialidad.id !== row.especialidad_id) {
                    currentEspecialidad = {
                        id: row.especialidad_id,
                        nombre: row.especialidad_nombre,
                        especialistas: []
                    };
                    especialidades.push(currentEspecialidad);
                }

                currentEspecialidad.especialistas.push({
                    id: row.usuario_id,
                    nombre: row.especialista_nombre,
                    primer_apellido: row.primer_apellido,
                    segundo_apellido: row.segundo_apellido,
                    imagen: row.imagen
                });
            });

            return especialidades;
        } catch (err) {
            console.log(err);
            throw new Error('Error al obtener las especialidades.');
        }
    }

    static async findById(dbConn, id) {
        const query =
            'SELECT ' +
            '    id, ' +
            '    nombre, ' +
            '    descripcion, ' +
            '    imagen ' +
            'FROM ' +
            '   especialidad ' +
            'WHERE ' +
            '   id = ?';

        try {
            const [rows] = await dbConn.execute(query, [id]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener la especialidad.');
        }
    }

    static async findByNombre(dbConn, nombre) {
        const query =
            'SELECT ' +
            '    id, ' +
            '    nombre, ' +
            '    descripcion, ' +
            '    imagen ' +
            'FROM ' +
            '   especialidad ' +
            'WHERE ' +
            '   nombre = ?';

        try {
            const [rows] = await dbConn.execute(query, [nombre]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener la especialidad.');
        }
    }

    static async save(dbConn, especialidad) {
        const nombre        = especialidad.nombre;
        const descripcion   = especialidad.descripcion;
        const imagen        = especialidad.imagen;

        const query =
            'INSERT INTO especialidad (nombre, descripcion, imagen) ' +
            'VALUES (?, ?, ?)';

        try {
            await dbConn.execute(query, [nombre, descripcion, imagen]);
        } catch (err) {
            console.log(err);
            throw new Error('Error al crear la especialidad.');
        }
    }

    static async deleteById(dbConn, id) {
        const query =
            'DELETE ' +
            'FROM ' +
            '   especialidad ' +
            'WHERE ' +
            '   id = ?';

        try {
            await dbConn.execute(query, [id]);
        } catch (err) {
            throw new Error('Error al eliminar la especialidad.');
        }
    }

    static async updateById(dbConn, id, especialidad) {
        const nombre        = especialidad.nombre;
        const descripcion   = especialidad.descripcion;
        const imagen        = especialidad.imagen;

        try {
            const currentEspecialidad = await this.findById(dbConn, id);

            if (!currentEspecialidad) {
                throw new Error('Especialidad no encontrada.');
            }

            const query =
                'UPDATE ' +
                '   especialidad ' +
                'SET ' +
                '   nombre = ?, ' +
                '   descripcion = ?, ' +
                '   imagen = ? ' +
                'WHERE ' +
                '   id = ?';

            await dbConn.execute(query, [nombre, descripcion, imagen, id]);
        } catch (err) {
            console.log(err)
            throw new Error('Error al actualizar la especialidad.');
        }
    }
}

module.exports = EspecialidadModel;