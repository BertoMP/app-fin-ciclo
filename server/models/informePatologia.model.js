class InformePatologiaModel {
  static async addPatologia(conn, informeId, patologiaId) {
    const query =
      'INSERT INTO informe_patologia (informe_id, patologia_id) ' +
      '   VALUES (?, ?)';

    try {
      await conn.execute(query, [informeId, patologiaId]);
    } catch (err) {
      throw new Error('Error al añadir la patología al informe.');
    }
  }
}

module.exports = InformePatologiaModel;