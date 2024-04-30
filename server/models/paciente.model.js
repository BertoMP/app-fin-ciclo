class PacienteModel {
  static async findAll(dbConn) {
    const query =
      'SELECT ' +
      '   paciente.usuario_id AS paciente_id,' +
      '   usuario.nombre AS nombre,' +
      '   usuario.primer_apellido AS primer_apellido,' +
      '   usuario.segundo_apellido AS segundo_apellido,' +
      '   paciente.num_historia_clinica ' +
      'FROM ' +
      '   paciente ' +
      'INNER JOIN ' +
      '   usuario ON paciente.usuario_id = usuario.id';

    try {
      const [rows] = await dbConn.execute(query);

      return rows;
    } catch (err) {
      console.log(err)
      throw new Error('Error al obtener los pacientes.');
    }
  }

  static async create(paciente, dbConn) {
    const usuario_id = paciente.usuario_id;
    const num_hist_clinica = paciente.num_hist_clinica;
    const fecha_nacimiento = paciente.fecha_nacimiento;
    const tipo_via = paciente.tipo_via;
    const nombre_via = paciente.nombre_via;
    const numero = paciente.numero;
    const piso = paciente.piso;
    const puerta = paciente.puerta;
    const municipio = paciente.municipio;
    const codigo_postal = paciente.codigo_postal;
    const tel_fijo = paciente.tel_fijo;
    const tel_movil = paciente.tel_movil;

    const query =
      'INSERT INTO paciente ' +
      '(usuario_id, num_historia_clinica, fecha_nacimiento, tipo_via,' +
      ' nombre_via, numero, piso, puerta, municipio,' +
      ' codigo_postal, tel_fijo, tel_movil) ' +
      '   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    try {
      return await dbConn.execute(
        query,
        [usuario_id, num_hist_clinica, fecha_nacimiento, tipo_via,
          nombre_via, numero, piso, puerta, municipio,
          codigo_postal, tel_fijo, tel_movil]);
    } catch (err) {
      throw new Error('Error al crear el paciente.');
    }
  }

  static async findByNumHistClinica(num_hist_clinica, dbConn) {
    const query =
      'SELECT * ' +
      'FROM ' +
      '   paciente ' +
      'WHERE ' +
      '   num_historia_clinica = ?';

    try {
      const [rows] = await dbConn.execute(query, [num_hist_clinica]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el paciente.');
    }
  }

  static async findByUserId(usuario_id, dbConn) {
    const query =
      'SELECT * ' +
      'FROM ' +
      '   paciente ' +
      'WHERE ' +
      '   usuario_id = ?';

    try {
      const [rows] = await dbConn.execute(query, [usuario_id]);
      return rows[0];
    } catch (err) {
      console.log(err);
      throw new Error('Error al obtener el paciente.');
    }
  }

  static async deletePacienteByUserId(usuario_id, dbConn) {
    const query =
      'DELETE FROM paciente WHERE usuario_id = ?';

    try {
      return await dbConn.execute(query, [usuario_id]);
    } catch (err) {
      throw new Error('Error al eliminar el paciente.');
    }
  }

  static async update(paciente, dbConn) {
    const query =
      'UPDATE ' +
      '   paciente ' +
      'SET ' +
      '   fecha_nacimiento = ?, ' +
      '   tipo_via = ?, ' +
      '   nombre_via = ?, ' +
      '   numero = ?, ' +
      '   piso = ?, ' +
      '   puerta = ?, ' +
      '   municipio = ?, ' +
      '   codigo_postal = ?, ' +
      '   tel_fijo = ?, ' +
      '   tel_movil = ? ' +
      'WHERE ' +
      '   usuario_id = ?';

    try {
      return await dbConn.execute(
        query,
        [paciente.fecha_nacimiento, paciente.tipo_via, paciente.nombre_via,
          paciente.numero, paciente.piso, paciente.puerta, paciente.municipio,
          paciente.codigo_postal, paciente.tel_fijo, paciente.tel_movil,
          paciente.usuario_id]);
    } catch (err) {
      throw new Error('Error al actualizar el paciente.');
    }
  }
}

module.exports = PacienteModel;