/**
 * @class InformePatologiaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de informe_patologia.
 */
class InformePatologiaModel {
  /**
   * @method addPatologia
   * @description Método para añadir una patología a un informe.
   * @static
   * @async
   * @memberof InformePatologiaModel
   * @param {number} informeId - El ID del informe.
   * @param {number} patologiaId - El ID de la patología.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de inserción.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async addPatologia(informeId, patologiaId, dbConn) {
    const query =
      'INSERT INTO informe_patologia (informe_id, patologia_id) ' +
      '   VALUES (?, ?)';

    try {
      return await dbConn.execute(query, [informeId, patologiaId]);
    } catch (err) {
      throw new Error('Error al añadir la patología al informe.');
    }
  }

  /**
   * @method deletePatologiaByInformeId
   * @description Método para eliminar todas las patologías de un informe por su ID.
   * @static
   * @async
   * @memberof InformePatologiaModel
   * @param {number} informeId - El ID del informe.
   * @param {Object} dbConn - La conexión a la base de datos.
   * @returns {Promise<Object>} El resultado de la operación de eliminación.
   * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
   */
  static async deletePatologiaByInformeId(informeId, dbConn) {
    const query =
      'DELETE ' +
      'FROM ' +
      '   informe_patologia ' +
      'WHERE ' +
      '   informe_id = ?';

    try {
      return await dbConn.execute(query, [informeId]);
    } catch (err) {
      throw new Error('Error al eliminar las patologías del informe.');
    }
  }
}

// Exportación del modelo
module.exports = InformePatologiaModel;