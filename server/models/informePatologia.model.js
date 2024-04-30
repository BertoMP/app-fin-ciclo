class InformePatologiaModel {
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

module.exports = InformePatologiaModel;