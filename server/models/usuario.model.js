class UsuarioModel {
  static async fetchAll(searchValues, limit, dbConn) {
    const page = searchValues.page;
    const role_id = searchValues.role;

    const offset = ((page - 1) * limit);

    let query =
      'SELECT ' +
      '   usuario.id,' +
      '   email,' +
      '   usuario.nombre,' +
      '   primer_apellido,' +
      '   segundo_apellido,' +
      '   dni,' +
      '   rol_id,' +
      '   rol.nombre AS nombre_rol ' +
      'FROM ' +
      '   usuario ' +
      'INNER JOIN ' +
      '   rol ON usuario.rol_id = rol.id ';

    let countQuery = 'SELECT COUNT(*) AS count FROM usuario';

    let queryParams = [`${limit}`, `${offset}`];
    let countParams = [];

    if (role_id) {
      query +=
        'WHERE ' +
        '   rol_id = ? ';
      countQuery +=
        ' WHERE ' +
        '   rol_id = ?';
      queryParams.unshift(`${role_id}`);
      countParams.push(`${role_id}`);
    }

    query +=
      'ORDER BY ' +
      '   usuario.id ASC ' +
      'LIMIT ? OFFSET ?';

    try {
      const [rows] = await dbConn.execute(query, queryParams);
      const [count] = await dbConn.execute(countQuery, countParams);
      const total = count[0].count;
      const actualPage = page;
      const totalPages = Math.ceil(total / limit);

      return {rows, total, actualPage, totalPages};
    } catch (err) {
      throw new Error('Error al obtener los usuarios.');
    }
  }

  static async findPacienteById(id, dbConn) {
    const query =
      'SELECT ' +
      '   usuario.id,' +
      '   email,' +
      '   usuario.nombre,' +
      '   primer_apellido,' +
      '   segundo_apellido,' +
      '   dni,' +
      '   num_historia_clinica, ' +
      '   fecha_nacimiento, ' +
      '   tipo_via, ' +
      '   nombre_via, ' +
      '   numero, ' +
      '   piso, ' +
      '   puerta, ' +
      '   provincia_id, ' +
      '   municipio, ' +
      '   codigo_postal, ' +
      '   tel_fijo, ' +
      '   tel_movil ' +
      'FROM ' +
      '   usuario ' +
      'INNER JOIN ' +
      '   rol ON usuario.rol_id = rol.id ' +
      'INNER JOIN ' +
      '   paciente ON usuario.id = paciente.usuario_id ' +
      'INNER JOIN ' +
      '   municipio ON paciente.municipio = municipio.id ' +
      'INNER JOIN ' +
      '   provincia ON municipio.provincia_id = provincia.id ' +
      'WHERE ' +
      '   usuario.id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      let paciente = rows[0];
      paciente.fecha_nacimiento = new Date(paciente.fecha_nacimiento).toISOString().split('T')[0];
      return paciente;
    } catch (err) {
      throw new Error('Error al obtener el paciente.');
    }
  }

  static async findEspecialistaById(id, dbConn) {
    const query =
      'SELECT ' +
      '   usuario.id,' +
      '   email,' +
      '   usuario.nombre,' +
      '   primer_apellido,' +
      '   segundo_apellido,' +
      '   dni,' +
      '   num_colegiado, ' +
      '   descripcion, ' +
      '   especialidad_id, ' +
      '   consulta_id, ' +
      '   turno, ' +
      '   imagen, ' +
      '   descripcion ' +
      'FROM ' +
      '   usuario ' +
      'INNER JOIN ' +
      '   rol ON usuario.rol_id = rol.id ' +
      'INNER JOIN ' +
      '   especialista ON usuario.id = especialista.usuario_id ' +
      'WHERE ' +
      '   usuario.id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el especialista.');
    }
  }

  static async findRoleById(id, dbConn) {
    const query =
      'SELECT ' +
      '   rol_id ' +
      'FROM ' +
      '   usuario ' +
      'WHERE ' +
      '   id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0].rol_id;
    } catch (err) {
      throw new Error('Error al obtener el rol del usuario.');
    }
  }

  static async findByEmail(email, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   email, ' +
      '   password,' +
      '   nombre, ' +
      '   primer_apellido, ' +
      '   segundo_apellido, ' +
      '   dni, ' +
      '   rol_id ' +
      'FROM ' +
      '   usuario ' +
      'WHERE ' +
      '   email = ?';

    try {
      const [rows] = await dbConn.execute(query, [email]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el usuario.');
    }
  }

  static async findByDNI(dni, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   email, ' +
      '   nombre, ' +
      '   primer_apellido, ' +
      '   segundo_apellido, ' +
      '   dni, ' +
      '   rol_id ' +
      'FROM ' +
      '   usuario ' +
      'WHERE ' +
      '   dni = ?';

    try {
      const [rows] = await dbConn.execute(query, [dni]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el usuario.');
    }
  }

  static async create(usuario, dbConn) {
    const email = usuario.email;
    const password = usuario.password;
    const nombre = usuario.nombre;
    const primer_apellido = usuario.primer_apellido;
    const segundo_apellido = usuario.segundo_apellido;
    const dni = usuario.dni;
    const rol_id = usuario.rol_id;

    const query =
      'INSERT INTO usuario ' +
      '(email, password, nombre, primer_apellido, segundo_apellido, ' +
      ' dni, rol_id) ' +
      '   VALUES (?, ?, ?, ?, ?, ?, ?)';

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

  static async updatePassword(email, password, dbConn) {
    const query =
      'UPDATE ' +
      '   usuario ' +
      'SET ' +
      '   password = ? ' +
      'WHERE ' +
      '   email = ?';

    try {
      return await dbConn.execute(query, [password, email]);
    } catch (err) {
      throw new Error('Error al actualizar la contraseña.');
    }
  }

  static async getEmailById(id, dbConn) {
    const query =
      'SELECT ' +
      '   email ' +
      'FROM ' +
      '   usuario ' +
      'WHERE ' +
      '   id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0].email;
    } catch (err) {
      throw new Error('Error al obtener el email.');
    }
  }

  static async delete(id, dbConn) {
    const query =
      'DELETE ' +
      'FROM ' +
      '   usuario ' +
      'WHERE ' +
      '   id = ?';

    try {
      return await dbConn.execute(query, [id]);
    } catch (err) {
      throw new Error('Error al eliminar el usuario.');
    }
  }

  static async updateRefreshToken(userId, refreshToken, dbConn) {
    const query =
      'UPDATE ' +
      '   usuario ' +
      'SET ' +
      '   refresh_token = ? ' +
      'WHERE ' +
      '   id = ?';

    try {
      return await dbConn.execute(query, [refreshToken, userId]);
    } catch (err) {
      throw new Error('Error al actualizar el token de refresco.');
    }
  }

  static async findById(id, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   email, ' +
      '   nombre, ' +
      '   primer_apellido, ' +
      '   segundo_apellido, ' +
      '   dni, ' +
      '   rol_id ' +
      'FROM ' +
      '   usuario ' +
      'WHERE ' +
      '   id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el usuario.');
    }
  }

  static async update(usuario, dbConn) {
    const query =
      'UPDATE ' +
      '   usuario ' +
      'SET ' +
      '   email = ?, ' +
      '   nombre = ?, ' +
      '   primer_apellido = ?, ' +
      '   segundo_apellido = ?, ' +
      '   dni = ? ' +
      'WHERE ' +
      '   id = ?';

    try {
      return await dbConn.execute(
        query,
        [usuario.email, usuario.nombre, usuario.primer_apellido,
          usuario.segundo_apellido, usuario.dni, usuario.id]);
    } catch (err) {
      throw new Error('Error al actualizar el usuario.');
    }
  }
}

module.exports = UsuarioModel;