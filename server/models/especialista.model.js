class EspecialistaModel {
    static async create(dbConn, especialista) {
        const usuario_id = especialista.usuario_id;
        const especialidad_id = especialista.especialidad_id;
        const consulta_id = especialista.consulta_id;
        const num_colegiado = especialista.num_colegiado;
        const descripcion = especialista.descripcion;
        const imagen = especialista.imagen;
        const turno = especialista.turno;

        const query =
            'INSERT INTO especialista ' +
            '(usuario_id, especialidad_id, consulta_id, num_colegiado, ' +
            'descripcion, imagen, turno) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)';

        try {
            await dbConn.execute(
                query,
                [usuario_id, especialidad_id, consulta_id, num_colegiado,
                    descripcion, imagen, turno]);
        } catch (err) {
            console.log(err);
            throw new Error('Error al crear el especialista.');
        }
    }

    static async findByNumColegiado(dbConn, num_colegiado) {
        const query =
            'SELECT * FROM especialista ' +
            'WHERE num_colegiado = ?';

        try {
            const [rows] = await dbConn.execute(query, [num_colegiado]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener el especialista.');
        }
    }
}

module.exports = EspecialistaModel;