/**
 * @class CodigoPostalMunicipioModel
 * @description Clase que contiene los métodos para interactuar con la tabla de códigos postales y municipios.
 */
class CodigoPostalMunicipioModel {
  /**
   * @method findByMunicipioId
   * @description Método para obtener los códigos postales de un municipio por su ID.
   * @static
   * @async
   * @memberof CodigoPostalMunicipioModel
   * @param {string} cod_municipio - El código del municipio.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de códigos postales del municipio.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async findByMunicipioId(cod_municipio, dbConn) {
    const query =
      'SELECT ' +
      '   codigo_postal_id ' +
      'FROM ' +
      '   codigo_postal_municipio ' +
      'WHERE ' +
      '   municipio_id = ?';

    cod_municipio = cod_municipio.toString().padStart(5, '0');

    try {
      const [rows] = await dbConn.query(query, [cod_municipio]);

      return rows;
    } catch (err) {
      throw new Error('Error al conseguir los códigos postales del municipio.');
    }
  }
}

// Exportación del modelo
module.exports = CodigoPostalMunicipioModel;