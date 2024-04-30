const PacienteTomaMedicamentoModel = require('../models/pacienteTomaMedicamento.model');
const TomaService = require('./toma.service');
const dbConn = require("../util/database/database");

class PacienteTomaMedicamentoService {
  static async createPrescripcion(pacienteId, prescripciones, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

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
            observaciones = observaciones.replace(/(\r\n|\n|\r)/g, '<br>');
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
            await PacienteTomaMedicamentoModel.updateToma(prescripcion.id, prescripcion, conn);
          } else {
            const existingToma = await PacienteTomaMedicamentoModel.findTomaByHora(pacienteId, medicamentoId, prescripcion.hora, conn);

            if (existingToma) {
              throw new Error('Ya existe una toma para este medicamento a esta hora. Por favor, realice una actualización en lugar de una inserción.');
            }

            const idToma = await TomaService.createToma(prescripcion, conn);
            await PacienteTomaMedicamentoModel.createPacienteTomaMedicamento(pacienteId, medicamentoId, idToma, conn);
          }
        }
      }

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async readTomasByUserId(userId, conn = dbConn) {
    try {
      return await PacienteTomaMedicamentoModel.findTomasByUserId(userId, conn);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async findMedicamento(pacienteId, medicamentoId, conn = dbConn) {
    try {
      return await PacienteTomaMedicamentoModel.findPrescripcion(pacienteId, medicamentoId, conn);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async findPrescripciones(pacienteId, conn = dbConn) {
    try {
      return await PacienteTomaMedicamentoModel.findPrescripciones(pacienteId, conn);
    } catch (err) {
      throw new Error(err);
    }
  }

  static async deleteToma(tomaId, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      await PacienteTomaMedicamentoModel.deleteToma(tomaId, conn);

      await TomaService.deleteToma(tomaId, conn);

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }

  static async deleteMedicamento(pacienteId, medicamentoId, conn = null) {
    const isConnProvided = !!conn;

    if (!isConnProvided) {
      conn = await dbConn.getConnection();
    }

    try {
      if (!isConnProvided) {
        await conn.beginTransaction();
      }

      const tomas = await PacienteTomaMedicamentoModel.findPrescripcion(pacienteId, medicamentoId, conn);

      for (const toma of tomas) {
        await PacienteTomaMedicamentoModel.deleteToma(toma, conn);
        await TomaService.deleteToma(toma, conn);
      }

      if (!isConnProvided) {
        await conn.commit();
      }
    } catch (err) {
      if (!isConnProvided) {
        await conn.rollback();
      }
      throw new Error(err);
    } finally {
      if (!isConnProvided) {
        conn.release();
      }
    }
  }
}

module.exports = PacienteTomaMedicamentoService;