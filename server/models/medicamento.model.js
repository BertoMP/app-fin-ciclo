class MedicamentoModel {
    static async fetchAll(dbConn, page) {
        const limit = 10;
        const offset = ((page - 1) * limit);

        const query =
            'SELECT nombre, descripcion FROM medicamento ' +
            'ORDER BY nombre ASC ' +
            'LIMIT ? OFFSET ?';

        try {
            const [rows] =
                await dbConn.execute(query, [`${limit}`, `${offset}`]);
            const [count] =
                await dbConn.execute(
                    'SELECT COUNT(*) AS count FROM medicamento'
                );
            const total = count[0].count;
            const actualPage = page;
            const totalPages = Math.ceil(total / limit);

            return { rows, total, actualPage, totalPages };
        } catch (err) {
            throw new Error('Error al obtener los medicamentos.');
        }
    }

    static async findById(dbConn, id) {
        const query =
            'SELECT nombre, descripcion FROM medicamento ' +
            'WHERE id = ?';

        try {
            const [rows] = await dbConn.execute(query, [id]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener el medicamento.');
        }
    }

    static async findByNombre(dbConn, nombre) {
        const query =
            'SELECT nombre, descripcion FROM medicamento ' +
            'WHERE nombre = ?';

        try {
            const [rows] = await dbConn.execute(query, [nombre]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener el medicamento.');
        }
    }

    static async save(dbConn, medicamento) {
        const nombre = medicamento.nombre;
        const descripcion = medicamento.descripcion;

        const query =
            'INSERT INTO medicamento (nombre, descripcion) ' +
            'VALUES (?, ?)';

        try {
            await dbConn.execute(query, [nombre, descripcion]);
        } catch (err) {
            throw new Error('Error al crear el medicamento.');
        }
    }

    static async deleteById(dbConn, id) {
        const query =
            'DELETE FROM medicamento ' +
            'WHERE id = ?';

        try {
            await dbConn.execute(query, [id]);
        } catch (err) {
            throw new Error('Error al eliminar el medicamento.');
        }
    }

    static async updateById(dbConn, id, medicamento) {
        const nombre = medicamento.nombre;
        const descripcion = medicamento.descripcion;

        try {
            const currentMedicamento = await this.findById(dbConn, id);

            if (!currentMedicamento) {
                throw new Error('Medicamento no encontrado.');
            }

            const query =
                'UPDATE medicamento ' +
                'SET nombre = ?, ' +
                'descripcion = ? ' +
                'WHERE id = ?';

            await dbConn.execute(query, [nombre, descripcion, id]);
        } catch (err) {
            throw new Error('Error al actualizar el medicamento.');
        }
    }
}

module.exports = MedicamentoModel;