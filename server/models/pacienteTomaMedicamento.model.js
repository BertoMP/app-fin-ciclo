const {format} = require('date-fns');

class PacienteTomaMedicamentoModel {
  static async findPrescripciones(dbConn, pacienteId) {
    const query =
      'SELECT ' +
      '   usuario.id as paciente_id, ' +
      '   usuario.nombre, ' +
      '   usuario.primer_apellido, ' +
      '   usuario.segundo_apellido, ' +
      '   paciente.num_historia_clinica, ' +
      '   medicamento.id as medicamento_id, ' +
      '   medicamento.nombre as medicamento_nombre, ' +
      '   medicamento.descripcion, ' +
      '   toma.id as toma_id, ' +
      '   toma.hora, ' +
      '   toma.dosis, ' +
      '   toma.fecha_inicio, ' +
      '   toma.fecha_fin, ' +
      '   toma.observaciones ' +
      'FROM ' +
      '   paciente_toma_medicamento ' +
      'INNER JOIN ' +
      '   paciente on paciente.usuario_id = paciente_toma_medicamento.paciente_id ' +
      'INNER JOIN ' +
      '   usuario on usuario.id = paciente.usuario_id ' +
      'INNER JOIN ' +
      '   medicamento on medicamento.id = paciente_toma_medicamento.medicamento_id ' +
      'INNER JOIN ' +
      '   toma on toma.id = paciente_toma_medicamento.toma_id ' +
      'WHERE ' +
      '   usuario.id = ?';

    try {
      const [rows] = await dbConn.execute(query, [pacienteId]);

      const result = {
        datos_paciente: {},
        prescripciones: []
      };

      for (const row of rows) {
        if (!result.datos_paciente.id) {
          result.datos_paciente = {
            id: row.paciente_id,
            nombre: row.nombre,
            primer_apellido: row.primer_apellido,
            segundo_apellido: row.segundo_apellido,
            num_historia_clinica: row.num_historia_clinica
          };
        }

        let prescripcion = result.prescripciones.find(prescripcion => prescripcion.medicamento.id === row.medicamento_id);

        if (!prescripcion) {
          prescripcion = {
            medicamento: {
              id: row.medicamento_id,
              nombre: row.medicamento_nombre,
              descripcion: row.descripcion,
              tomas: []
            }
          };

          result.prescripciones.push(prescripcion);
        }

        prescripcion.medicamento.tomas.push({
          id: row.toma_id,
          hora: format(new Date(`1970-01-01T${row.hora}Z`), 'HH:mm'),
          dosis: row.dosis,
          fecha_inicio: format(new Date(row.fecha_inicio), 'dd-MM-yyyy'),
          fecha_fin: row.fecha_fin ? format(new Date(row.fecha_fin), 'dd-MM-yyyy') : null,
          observaciones: row.observaciones
        });
      }

      return result;
    } catch (error) {
      throw new Error('Error al buscar las prescripciones.');
    }
  }

  static async createPacienteTomaMedicamento(dbConn, pacienteId, medicamentoId, tomaId) {
    const query =
      'INSERT INTO paciente_toma_medicamento (paciente_id, medicamento_id, toma_id) ' +
      '   VALUES (?, ?, ?)';

    try {
      await dbConn.execute(query, [pacienteId, medicamentoId, tomaId]);
    } catch (error) {
      throw new Error('Error al guardar la receta.');
    }
  }

  static async findPrescripcion(dbConn, pacienteId, medicamentoId) {
    const query =
      'SELECT ' +
      '   toma_id ' +
      'FROM ' +
      '   paciente_toma_medicamento ' +
      'WHERE ' +
      '   paciente_id = ? ' +
      '   AND medicamento_id = ?';

    try {
      const [rows] = await dbConn.execute(query, [pacienteId, medicamentoId]);

      return rows.map(row => row.toma_id);
    } catch (error) {
      throw new Error('Error al buscar la prescripción.');
    }
  }

  static async updateToma(conn, idToma, prescripcion) {
    const dosis = prescripcion.dosis;
    const hora = prescripcion.hora;
    const fecha_inicio = prescripcion.fecha_inicio;
    const fecha_fin = prescripcion.fecha_fin ?? null;
    const observaciones = prescripcion.observaciones ?? null;

    const query =
      'UPDATE toma ' +
      'SET ' +
      '   dosis = ?, ' +
      '   hora = ?, ' +
      '   fecha_inicio = ?, ' +
      '   fecha_fin = ?, ' +
      '   observaciones = ? ' +
      'WHERE id = ?';

    try {
      await conn.execute(query, [dosis, hora, fecha_inicio, fecha_fin, observaciones, idToma]);
    } catch (error) {
      throw new Error('Error al actualizar la toma.');
    }
  }

  static async deleteToma(conn, idToma) {
    const query =
      'DELETE ' +
      'FROM paciente_toma_medicamento ' +
      'WHERE toma_id = ?';

    try {
      await conn.execute(query, [idToma]);
    } catch (error) {
      throw new Error('Error al eliminar la toma.');
    }
  }

  static async findTomasByUserId(dbConn, pacienteId) {
    const query =
      'SELECT ' +
      '   toma_id ' +
      'FROM ' +
      '   paciente_toma_medicamento ' +
      'WHERE ' +
      '   paciente_id = ?';

    try {
      const [rows] = await dbConn.execute(query, [pacienteId]);

      return rows.map(row => row.toma_id);
    } catch (error) {
      throw new Error('Error al buscar las tomas.');
    }
  }

  static async findTomaByHora(dbConn, pacienteId, medicamentoId, hora) {
    const query =
      'SELECT ' +
      '   toma_id ' +
      'FROM ' +
      '   paciente_toma_medicamento ' +
      'INNER JOIN ' +
      '   toma ON toma.id = paciente_toma_medicamento.toma_id ' +
      'WHERE ' +
      '   paciente_id = ? ' +
      '   AND medicamento_id = ? ' +
      '   AND hora = ?';

    try {
      const [rows] = await dbConn.execute(query, [pacienteId, medicamentoId, hora]);

      return rows[0];
    } catch (error) {
      throw new Error('Error al buscar la toma.');
    }
  }
}

module.exports = PacienteTomaMedicamentoModel;