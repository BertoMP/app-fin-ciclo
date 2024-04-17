class EspecialidadModel {
    /*
     * Obtiene todas las especialidades de la base de datos, utilizando
     * paginación.
     *
     * @param {object} dbConn - Conexión a la base de datos.
     * @param {number} page - Página a obtener.
     *
     * @returns {object} - Objeto con las especialidades, el total de
     * especialidades, la página actual y el total de páginas.
     *
     * @throws {Error} - Error de la base de datos.
     */
    static async fetchAll(dbConn, page) {
        const limit = 10;
        const offset = ((page - 1) * limit);

        const query =
            'SELECT * FROM especialidad ' +
            'ORDER BY id ASC ' +
            'LIMIT ? OFFSET ?';

        try {
            const [rows] =
                await dbConn.execute(query, [`${limit}`, `${offset}`]);
            const [count] =
                await dbConn.execute(
                    'SELECT COUNT(*) AS count FROM especialidad'
                );
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            return { rows, total, actualPage, totalPages };
        } catch (err) {
            throw new Error('Error al obtener las especialidades.');
        }
    }

    static async findById(dbConn, id) {
        const query = `SELECT * FROM especialidad WHERE id = ?`;

        try {
            const [rows] = await dbConn.execute(query, [id]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener la especialidad.');
        }
    }

    static async findByNombre(dbConn, nombre) {
        const query =
            'SELECT * FROM especialidad ' +
            'WHERE nombre = ?';

        try {
            const [rows] = await dbConn.execute(query, [nombre]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener la especialidad.');
        }
    }

    static async save(dbConn, especialidad) {
        const nombre = especialidad.nombre;
        const descripcion = especialidad.descripcion;
        const imagen = especialidad.imagen;

        const query =
            'INSERT INTO especialidad (nombre, descripcion, imagen) ' +
            'VALUES (?, ?, ?)';

        try {
            await dbConn.execute(query, [nombre, descripcion, imagen]);
        } catch (err) {
            throw new Error('Error al crear la especialidad.');
        }
    }

    static async deleteById(dbConn, id) {
        const query =
            'DELETE FROM especialidad ' +
            'WHERE id = ?';

        try {
            await dbConn.execute(query, [id]);
        } catch (err) {
            throw new Error('Error al eliminar la especialidad.');
        }
    }

    static async updateById(dbConn, id, especialidad) {
        const nombre = especialidad.nombre;
        const descripcion = especialidad.descripcion;

        try {
            const currentEspecialidad = await this.findById(dbConn, id);

            if (!currentEspecialidad) {
                throw new Error('Especialidad no encontrada.');
            }

            const query =
                'UPDATE especialidad ' +
                'SET nombre = ?, ' +
                'descripcion = ? ' +
                'WHERE id = ?';

            await dbConn.execute(query, [nombre, descripcion, id]);
        } catch (err) {
            throw new Error('Error al actualizar la especialidad.');
        }
    }
}

module.exports = EspecialidadModel;