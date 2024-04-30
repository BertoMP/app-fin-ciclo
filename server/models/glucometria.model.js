const momentTz = require("moment-timezone");

class GlucometriaModel {
  static async fetchAll(searchValues, limit, dbConn) {
    const page = searchValues.page;
    const fechaInicio = searchValues.fechaInicio;
    const fechaFin = searchValues.fechaFin;
    const paciente_id = searchValues.paciente_id;

    const offset = ((page - 1) * limit);

    const query =
      'SELECT ' +
      '   fecha, ' +
      '   hora, ' +
      '   medicion ' +
      'FROM ' +
      '   glucometria ' +
      'WHERE ' +
      '   fecha BETWEEN ? AND ? AND ' +
      '   paciente_id = ? ' +
      'ORDER BY ' +
      '   fecha DESC, ' +
      '   hora DESC ' +
      'LIMIT ? OFFSET ?';

    try {
      const [rows] =
        await dbConn.execute(query,
          [fechaInicio, fechaFin, paciente_id, `${limit}`, `${offset}`]);

      const [count] =
        await dbConn.execute(
          'SELECT ' +
          '   COUNT(*) AS count ' +
          'FROM ' +
          '   glucometria ' +
          'WHERE ' +
          '   fecha BETWEEN ? AND ? AND ' +
          '   paciente_id = ?',
          [fechaInicio, fechaFin, paciente_id]
        );
      const total = count[0].count;
      const actualPage = page;
      const totalPages = Math.ceil(total / limit);

      rows.forEach(glucometria => {
        glucometria.fecha = momentTz.tz(glucometria.fecha, 'Europe/Madrid')
          .format('DD-MM-YYYY');
      });

      return {rows, total, actualPage, totalPages};
    } catch (err) {
      throw new Error('No se pudieron obtener las mediciones de glucosa.');
    }
  }

  static async create(glucometria, dbConn) {
    const paciente_id = glucometria.paciente_id;
    const fecha = glucometria.fecha;
    const hora = glucometria.hora;
    const medicion = glucometria.medicion;

    const query =
      'INSERT INTO glucometria (paciente_id, fecha, hora, medicion) ' +
      'VALUES (?, ?, ?, ?)';

    try {
      return await dbConn.execute(query, [paciente_id, fecha, hora, medicion]);
    } catch (err) {
      throw new Error('No se pudo crear la medición de glucosa.');
    }
  }

  static async deleteGlucometriasByUserId(paciente_id, dbConn) {
    const query =
      'DELETE ' +
      'FROM ' +
      '   glucometria ' +
      'WHERE ' +
      '   paciente_id = ?';
    try {
      return await dbConn.execute(query, [paciente_id]);
    } catch (err) {
      throw new Error('No se pudieron eliminar las mediciones de glucosa.');
    }
  }
}

module.exports = GlucometriaModel;