class PatologiaModel {
  static async fetchAllInforme(dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre ' +
      'FROM ' +
      '   patologia';

    try {
      const [rows] = await dbConn.execute(query);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener las patologías.');
    }
  }

  static async fetchAll(dbConn, page, limit) {
    const offset = ((page - 1) * limit);

    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   patologia ' +
      'LIMIT ? OFFSET ?';

    try {
      const [rows] =
        await dbConn.execute(query, [`${limit}`, `${offset}`]);
      const [count] =
        await dbConn.execute(
          'SELECT ' +
          '   COUNT(*) AS count ' +
          'FROM ' +
          '   patologia'
        );
      const total = count[0].count;
      const actualPage = page;
      const totalPages = Math.ceil(total / limit);

      return {rows, total, actualPage, totalPages};
    } catch (err) {
      throw new Error('Error al obtener las patologías.');
    }
  }

  static async findById(dbConn, id) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   patologia ' +
      'WHERE ' +
      '   id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el patologia.');
    }
  }

  static async findByNombre(dbConn, nombre) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   patologia ' +
      'WHERE ' +
      '   nombre = ?';

    try {
      const [rows] = await dbConn.execute(query, [nombre]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener la patología.');
    }
  }

  static async save(dbConn, patologia) {
    const nombre = patologia.nombre;
    const descripcion = patologia.descripcion;

    const query =
      'INSERT INTO patologia (nombre, descripcion) ' +
      '   VALUES (?, ?)';

    try {
      await dbConn.execute(query, [nombre, descripcion]);
    } catch (err) {
      throw new Error('Error al guardar la patología.');
    }
  }

  static async updateById(dbConn, id, patologia) {
    const nombre = patologia.nombre;
    const descripcion = patologia.descripcion;

    const query =
      'UPDATE ' +
      '   patologia ' +
      'SET ' +
      '   nombre = ?, ' +
      '   descripcion = ? ' +
      'WHERE ' +
      '   id = ?';

    try {
      await dbConn.execute(query, [nombre, descripcion, id]);
    } catch (err) {
      throw new Error('Error al actualizar la patología.');
    }
  }
}

module.exports = PatologiaModel