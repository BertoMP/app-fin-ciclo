/**
 * @class EspecialidadModel
 * @description Clase que contiene los métodos para interactuar con la tabla de especialidades.
 */
class EspecialidadModel {
  /**
   * @method fetchAll
   * @description Método para obtener todas las especialidades con paginación.
   * @static
   * @async
   * @memberof EspecialidadModel
   * @param {number} page - La página actual.
   * @param {number} limit - El número de especialidades por página.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que contiene las especialidades, el total de especialidades, la página actual y el total de páginas.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async fetchAll(page, limit, dbConn) {
    const offset = ((page - 1) * limit);

    const query =
      'SELECT ' +
      '    id, ' +
      '    nombre, ' +
      '    descripcion, ' +
      '    imagen ' +
      'FROM ' +
      '   especialidad ' +
      'ORDER BY ' +
      '   id ASC ' +
      'LIMIT ? OFFSET ?';

    try {
      const [rows] =
        await dbConn.execute(query, [`${limit}`, `${offset}`]);
      const [count] =
        await dbConn.execute(
          'SELECT ' +
          '   COUNT(*) AS count ' +
          'FROM ' +
          '   especialidad'
        );
      const total = count[0].count;
      const actualPage = page;
      const totalPages = Math.ceil(total / limit);

      return {rows, total, actualPage, totalPages};
    } catch (err) {
      throw new Error('Error al obtener las especialidades.');
    }
  }

  /**
   * @method fetchAllEspecialidadesEspecialistas
   * @description Método para obtener todas las especialidades y sus especialistas.
   * @static
   * @async
   * @memberof EspecialidadModel
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de especialidades y sus especialistas.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async fetchAllEspecialidadesEspecialistas(dbConn) {
    const query =
      'SELECT' +
      '    especialidad.id AS especialidad_id,' +
      '    especialidad.nombre AS especialidad_nombre,' +
      '    usuario.id AS usuario_id,' +
      '    usuario.nombre AS especialista_nombre,' +
      '    usuario.primer_apellido ,' +
      '    usuario.segundo_apellido ,' +
      '    especialista.imagen ' +
      'FROM' +
      '    especialidad ' +
      'INNER JOIN' +
      '    especialista ON especialidad.id = especialista.especialidad_id ' +
      'INNER JOIN' +
      '    usuario ON especialista.usuario_id = usuario.id ' +
      'WHERE' +
      '    especialista.turno <> ? ' +
      'ORDER BY' +
      '    especialidad.id ASC, ' +
      '    usuario.id ASC';

    try {
      const [rows] = await dbConn.execute(query, ['no-trabajando']);
      const especialidades = [];
      let currentEspecialidad = null;

      rows.forEach(row => {
        if (!currentEspecialidad || currentEspecialidad.id !== row.especialidad_id) {
          currentEspecialidad = {
            id: row.especialidad_id,
            nombre: row.especialidad_nombre,
            especialistas: []
          };
          especialidades.push(currentEspecialidad);
        }

        currentEspecialidad.especialistas.push({
          id: row.usuario_id,
          nombre: row.especialista_nombre,
          primer_apellido: row.primer_apellido,
          segundo_apellido: row.segundo_apellido,
          imagen: row.imagen
        });
      });

      return especialidades;
    } catch (err) {
      throw new Error('Error al obtener las especialidades.');
    }
  }

  /**
   * @method findById
   * @description Método para obtener una especialidad por su ID.
   * @static
   * @async
   * @memberof EspecialidadModel
   * @param {number} id - El ID de la especialidad.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} La especialidad.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async findById(id, dbConn) {
    const query =
      'SELECT ' +
      '    id, ' +
      '    nombre, ' +
      '    descripcion, ' +
      '    imagen ' +
      'FROM ' +
      '   especialidad ' +
      'WHERE ' +
      '   id = ?';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener la especialidad.');
    }
  }

  /**
   * @method findByNombre
   * @description Método para obtener una especialidad por su nombre.
   * @static
   * @async
   * @memberof EspecialidadModel
   * @param {string} nombre - El nombre de la especialidad.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} La especialidad.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async findByNombre(nombre, dbConn) {
    const query =
      'SELECT ' +
      '    id, ' +
      '    nombre, ' +
      '    descripcion, ' +
      '    imagen ' +
      'FROM ' +
      '   especialidad ' +
      'WHERE ' +
      '   nombre = ?';

    try {
      const [rows] = await dbConn.execute(query, [nombre]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener la especialidad.');
    }
  }

  /**
   * @method save
   * @description Método para guardar una nueva especialidad.
   * @static
   * @async
   * @memberof EspecialidadModel
   * @param {Object} especialidad - El objeto de la nueva especialidad.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} La nueva especialidad creada.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async save(especialidad, dbConn) {
    const nombre      = especialidad.nombre;
    const descripcion = especialidad.descripcion;
    const imagen      = especialidad.imagen;

    const query =
      'INSERT INTO especialidad (nombre, descripcion, imagen) ' +
      'VALUES (?, ?, ?)';

    try {
      return await dbConn.execute(query, [nombre, descripcion, imagen]);
    } catch (err) {
      throw new Error('Error al crear la especialidad.');
    }
  }

  /**
   * @method deleteById
   * @description Método para eliminar una especialidad por su ID.
   * @static
   * @async
   * @memberof EspecialidadModel
   * @param {number} id - El ID de la especialidad.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<void>} No retorna nada si la operación es exitosa.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async deleteById(id, dbConn) {
    const query =
      'DELETE ' +
      'FROM ' +
      '   especialidad ' +
      'WHERE ' +
      '   id = ?';

    try {
      return await dbConn.execute(query, [id]);
    } catch (err) {
      throw new Error('Error al eliminar la especialidad.');
    }
  }

  /**
   * @method updateById
   * @description Método para actualizar una especialidad por su ID.
   * @static
   * @async
   * @memberof EspecialidadModel
   * @param {number} id - El ID de la especialidad.
   * @param {Object} especialidad - El objeto de la especialidad con los datos actualizados.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} La especialidad actualizada.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async updateById(id, especialidad, dbConn) {
    const nombre = especialidad.nombre;
    const descripcion = especialidad.descripcion;
    const imagen = especialidad.imagen;

    try {
      const currentEspecialidad = await EspecialidadModel.findById(id, dbConn);

      if (!currentEspecialidad) {
        throw new Error('Especialidad no encontrada.');
      }

      const query =
        'UPDATE ' +
        '   especialidad ' +
        'SET ' +
        '   nombre = ?, ' +
        '   descripcion = ?, ' +
        '   imagen = ? ' +
        'WHERE ' +
        '   id = ?';

      return await dbConn.execute(query, [nombre, descripcion, imagen, id]);
    } catch (err) {
      throw new Error('Error al actualizar la especialidad.');
    }
  }
}

// Exportación del modelo
module.exports = EspecialidadModel;