/**
 * @class MunicipioModel
 * @description Clase que contiene los métodos para interactuar con la tabla de municipios.
 */
class MunicipioModel {
  /**
   * @method fetchByProvinciaId
   * @description Método para obtener los municipios por el ID de la provincia.
   * @static
   * @async
   * @memberof MunicipioModel
   * @param {number} id - El ID de la provincia.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de municipios.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async fetchByProvinciaId(id, dbConn) {
    const query =
      'SELECT ' +
      '   id, ' +
      '   nombre ' +
      'FROM ' +
      '   municipio ' +
      'WHERE ' +
      '   provincia_id = ? ' +
      'ORDER BY ' +
      '   nombre';

    try {
      const [rows] = await dbConn.execute(query, [id]);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener los municipios.');
    }
  }
}

// Exportación del modelo
module.exports = MunicipioModel;