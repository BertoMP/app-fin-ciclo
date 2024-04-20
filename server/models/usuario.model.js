class UsuarioModel {
    static async findByEmail(dbConn, email) {
        const query =
            'SELECT * FROM usuario ' +
            'WHERE email = ?';

        try {
            const [rows] = await dbConn.execute(query, [email]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener el usuario.');
        }
    }

    static async findByDNI(dbConn, dni) {
        const query =
            'SELECT * FROM usuario ' +
            'WHERE dni = ?';

        try {
            const [rows] = await dbConn.execute(query, [dni]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener el usuario.');
        }
    }

    static async create(dbConn, usuario) {
        const email             = usuario.email;
        const password          = usuario.password;
        const nombre            = usuario.nombre;
        const primer_apellido   = usuario.primer_apellido;
        const segundo_apellido  = usuario.segundo_apellido;
        const dni               = usuario.dni;
        const rol_id            = usuario.rol_id;

        const query =
            'INSERT INTO usuario ' +
            '(email, password, nombre, primer_apellido, segundo_apellido,' +
            ' dni, rol_id) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)';

        try {
            const user = await dbConn.execute(
                query,
                [email, password, nombre,
                    primer_apellido, segundo_apellido, dni, rol_id]);

            return user[0].insertId;
        } catch (err) {
            throw new Error('Error al crear el usuario.');
        }
    }

    static async updatePassword(dbConn, email, password) {
        const query =
            'UPDATE usuario ' +
            'SET password = ? ' +
            'WHERE email = ?';

        try {
            await dbConn.execute(query, [password, email]);
        } catch (err) {
            throw new Error('Error al actualizar la contraseña.');
        }
    }

    static async getEmailById(dbConn, id) {
        const query =
            'SELECT email FROM usuario ' +
            'WHERE id = ?';

        try {
            const [rows] = await dbConn.execute(query, [id]);
            return rows[0].email;
        } catch (err) {
            throw new Error('Error al obtener el email.');
        }
    }

    static async delete(dbConn, id) {
        const query =
            'DELETE FROM usuario WHERE id = ?';

        try {
            await dbConn.execute(query, [id]);
        } catch (err) {
            throw new Error('Error al eliminar el usuario.');
        }
    }
}

module.exports = UsuarioModel;