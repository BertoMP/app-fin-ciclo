class PacienteModel {
    static async create(dbConn, paciente) {
        const usuario_id        = paciente.usuario_id;
        const num_hist_clinica  = paciente.num_hist_clinica;
        const fecha_nacimiento  = paciente.fecha_nacimiento;
        const tipo_via          = paciente.tipo_via;
        const nombre_via        = paciente.nombre_via;
        const numero            = paciente.numero;
        const piso              = paciente.piso;
        const puerta            = paciente.puerta;
        const provincia         = paciente.provincia;
        const municipio         = paciente.municipio;
        const codigo_postal     = paciente.codigo_postal;
        const tel_fijo          = paciente.tel_fijo;
        const tel_movil         = paciente.tel_movil;

        const query =
            'INSERT INTO paciente ' +
            '(usuario_id, num_historia_clinica, fecha_nacimiento, tipo_via, ' +
            'nombre_via, numero, piso, puerta, provincia, municipio, ' +
            'codigo_postal, tel_fijo, tel_movil) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        try {
            await dbConn.execute(
                query,
                [usuario_id, num_hist_clinica, fecha_nacimiento, tipo_via,
                    nombre_via, numero, piso, puerta, provincia, municipio,
                    codigo_postal, tel_fijo, tel_movil]);
        } catch (err) {
            console.log(err);
            throw new Error('Error al crear el paciente.');
        }
    }

    static async findByNumHistClinica(dbConn, num_hist_clinica) {
        const query =
            'SELECT * FROM paciente ' +
            'WHERE num_historia_clinica = ?';

        try {
            const [rows] = await dbConn.execute(query, [num_hist_clinica]);
            return rows[0];
        } catch (err) {
            throw new Error('Error al obtener el paciente.');
        }
    }
}

module.exports = PacienteModel;