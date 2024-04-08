class MedicamentoModel {
    static async fetchAll(dbConn, page) {
        const limit = 10;
        const offset = (page - 1) * limit;

        const query
            = 'SELECT nombre, descripcion FROM medicamento LIMIT ? OFFSET ?';

        try {
            const [rows] = await dbConn.execute(query, [`${limit}`, `${offset}`]);
            return rows;
        } catch (err) {
            console.log(err);
            throw new Error('Error al obtener los medicamentos.');
        }
    }

    static async findById(dbConn, id) {
        const query =
            `SELECT nombre, descripcion FROM medicamento WHERE id = ?`;
        const [rows] = await dbConn.execute(query, [id]);

        return rows[0];
    }

    static async save(dbConn, medicamento) {
        const nombre = medicamento.nombre;
        const descripcion = medicamento.descripcion;

        const query = 'INSERT INTO medicamento (nombre, descripcion) VALUES (?, ?)';
        await dbConn.execute(query, [nombre, descripcion]);
    }

    static async deleteById(dbConn, id) {
        const query = 'DELETE FROM medicamento WHERE id = ?';
        await dbConn.execute(query, [id]);
    }

    static async updateById(dbConn, id, medicamento) {
        const nombre = medicamento.nombre;
        const descripcion = medicamento.descripcion;

        const query = 'UPDATE medicamento SET nombre = ?, descripcion = ? WHERE id = ?';
        await dbConn.execute(query, [nombre, descripcion, id]);
    }
}

module.exports = MedicamentoModel;