class UsuarioModel {
    static async findByEmail(dbConn, email) {
        const query = 'SELECT * FROM usuario WHERE email = ?';

        try {
            const [rows] = await dbConn.execute(query, [email]);
            return rows[0];
        } catch (err) {
            console.log(err);
            throw new Error('Error al obtener el usuario.');
        }
    }

    static async create(dbConn, usuario) {
        const email = usuario.email;
        const password = usuario.password;
        const nombre = usuario.nombre;
        const primer_apellido = usuario.primer_apellido;
        const segundo_apellido = usuario.segundo_apellido;
        const id_rol = usuario.id_rol;

        const query =
            'INSERT INTO usuario (email, password, nombre, primer_apellido,' +
            ' segundo_apellido, id_rol) VALUES (?, ?, ?, ?, ?, ?)';

        try {
            await dbConn.execute(
                query,
                [email, password, nombre,
                    primer_apellido, segundo_apellido, id_rol]);
        } catch (err) {
            console.log(err);
            throw new Error('Error al crear el usuario.');
        }
    }
}

module.exports = UsuarioModel;