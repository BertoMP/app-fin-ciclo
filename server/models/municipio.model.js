class MunicipioModel {
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

module.exports = MunicipioModel;