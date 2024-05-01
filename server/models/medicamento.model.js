/**
 * @class MedicamentoModel
 * @description Clase que contiene los métodos para interactuar con la tabla de medicamentos.
 */
class MedicamentoModel {
  /**
   * @method fetchAllPrescripcion
   * @description Método para obtener todos los medicamentos ordenados por nombre.
   * @static
   * @async
   * @memberof MedicamentoModel
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de medicamentos.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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

  /**
   * @method fetchAll
   * @description Método para obtener todos los medicamentos con paginación.
   * @static
   * @async
   * @memberof MedicamentoModel
   * @param {number} page - La página actual.
   * @param {number} limit - El número de medicamentos por página.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto con los medicamentos, el total de medicamentos, la página actual y el total de páginas.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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

  /**
   * @method findById
   * @description Método para obtener un medicamento por su ID.
   * @static
   * @async
   * @memberof MedicamentoModel
   * @param {number} id - El ID del medicamento.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El medicamento.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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

  /**
   * @method findByNombre
   * @description Método para obtener un medicamento por su nombre.
   * @static
   * @async
   * @memberof MedicamentoModel
   * @param {string} nombre - El nombre del medicamento.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El medicamento.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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

  /**
   * @method save
   * @description Método para crear un nuevo medicamento.
   * @static
   * @async
   * @memberof MedicamentoModel
   * @param {Object} medicamento - El objeto del nuevo medicamento.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El nuevo medicamento creado.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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

  /**
   * @method updateById
   * @description Método para actualizar un medicamento por su ID.
   * @static
   * @async
   * @memberof MedicamentoModel
   * @param {number} id - El ID del medicamento.
   * @param {Object} medicamento - El objeto del medicamento con los datos actualizados.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El medicamento actualizado.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
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

// Exportación del modelo
module.exports = MedicamentoModel;