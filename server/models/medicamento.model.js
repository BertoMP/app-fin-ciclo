class MedicamentoModel {
  static async fetchAllPrescripcion(dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre ' +
      'FROM ' +
      '   medicamento ' +
      'ORDER BY ' +
      '   nombre ASC';

    try {
      const [rows] = await dbConn.execute(query);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener los medicamentos.');
    }
  }

  static async fetchAll(page, limit, dbConn) {
    const offset = ((page - 1) * limit);

    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   medicamento ' +
      'ORDER BY ' +
      '   nombre ASC ' +
      'LIMIT ? OFFSET ?';

    try {
      const [rows] =
        await dbConn.execute(query, [`${limit}`, `${offset}`]);
      const [count] =
        await dbConn.execute(
          'SELECT ' +
          '   COUNT(*) AS count ' +
          'FROM ' +
          '   medicamento'
        );
      const total = count[0].count;
      const actualPage = page;
      const totalPages = Math.ceil(total / limit);

      return {rows, total, actualPage, totalPages};
    } catch (err) {
      throw new Error('Error al obtener los medicamentos.');
    }
  }

  static async findById(id, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   medicamento ' +
      'WHERE ' +
      '   id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el medicamento.');
    }
  }

  static async findByNombre(nombre, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre, ' +
      '   descripcion ' +
      'FROM ' +
      '   medicamento ' +
      'WHERE ' +
      '   nombre = ?';

    try {
      const [rows] = await dbConn.execute(query, [nombre]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener el medicamento.');
    }
  }

  static async save(medicamento, dbConn) {
    const nombre = medicamento.nombre;
    const descripcion = medicamento.descripcion;

    const query =
      'INSERT INTO medicamento (nombre, descripcion) ' +
      'VALUES (?, ?)';

    try {
      return await dbConn.execute(query, [nombre, descripcion]);
    } catch (err) {
      throw new Error('Error al crear el medicamento.');
    }
  }

  static async updateById(id, medicamento, dbConn) {
    const nombre = medicamento.nombre;
    const descripcion = medicamento.descripcion;

    try {
      const currentMedicamento = await this.findById(dbConn, id);

      if (!currentMedicamento) {
        throw new Error('Medicamento no encontrado.');
      }

      const query =
        'UPDATE ' +
        '   medicamento ' +
        'SET ' +
        '   nombre = ?, ' +
        '   descripcion = ? ' +
        'WHERE ' +
        '   id = ?';

      return await dbConn.execute(query, [nombre, descripcion, id]);
    } catch (err) {
      throw new Error('Error al actualizar el medicamento.');
    }
  }
}

module.exports = MedicamentoModel;