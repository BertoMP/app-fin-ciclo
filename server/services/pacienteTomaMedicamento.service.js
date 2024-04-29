const PacienteTomaMedicamentoModel = require('../models/pacienteTomaMedicamento.model');
const TomaService = require('./toma.service');
const dbConn = require("../util/database/database");

class PacienteTomaMedicamentoService {
  static async createPrescripcion(pacienteId, prescripciones) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      for (const prescripcion of prescripciones) {
        const medicamentoId = prescripcion.medicamento_id;
        const tomas = prescripcion.tomas;

        if (!medicamentoId) {
          throw new Error('Debe especificar un medicamento para cada prescripción.');
        }

        if (!tomas || tomas.length === 0) {
          throw new Error('Debe especificar al menos una toma para cada medicamento.');
        }

        for (const toma of tomas) {
          let observaciones = toma.observaciones;

          if (observaciones) {
            observaciones = observaciones.replace(/\n/g, '<br>');
          }

          const prescripcion = {
            id: toma.toma_id,
            dosis: toma.dosis,
            hora: toma.hora,
            fecha_inicio: toma.fecha_inicio,
            fecha_fin: toma.fecha_fin,
            observaciones: toma.observaciones,
          }

          if (prescripcion.id) {
            await PacienteTomaMedicamentoModel.updateToma(conn, prescripcion.id, prescripcion);
          } else {
            const existingToma = await PacienteTomaMedicamentoModel.findTomaByHora(conn, pacienteId, medicamentoId, prescripcion.hora);

            if (existingToma) {
              throw new Error('Ya existe una toma para este medicamento a esta hora. Por favor, realice una actualización en lugar de una inserción.');
            }

            const idToma = await TomaService.createToma(conn, prescripcion);
            await PacienteTomaMedicamentoModel.createPacienteTomaMedicamento(conn, pacienteId, medicamentoId, idToma);
          }
        }
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    } finally {
      conn.release();
    }
  }

  static async findMedicamento(pacienteId, medicamentoId) {
    try {
      return await PacienteTomaMedicamentoModel.findPrescripcion(dbConn, pacienteId, medicamentoId);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async findPrescripciones(pacienteId) {
    try {
      return await PacienteTomaMedicamentoModel.findPrescripciones(dbConn, pacienteId);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async deleteToma(tomaId) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      await PacienteTomaMedicamentoModel.deleteToma(conn, tomaId);

      await TomaService.deleteToma(conn, tomaId);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    }
  }

  static async deleteMedicamento(pacienteId, medicamentoId) {
    const conn = await dbConn.getConnection();

    try {
      await conn.beginTransaction();

      const tomas = await PacienteTomaMedicamentoModel.findPrescripcion(conn, pacienteId, medicamentoId);

      for (const toma of tomas) {
        await PacienteTomaMedicamentoModel.deleteToma(conn, toma);
        await TomaService.deleteToma(conn, toma);
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw new Error(err);
    }
  }
}

module.exports = PacienteTomaMedicamentoService;