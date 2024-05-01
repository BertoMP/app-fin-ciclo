// Importación del modelo del servicio
const PacienteTomaMedicamentoModel  = require('../models/pacienteTomaMedicamento.model');

// Importación de servicios auxiliares
const TomaService                   = require('./toma.service');

// Importación de las utilidades necesarias
const dbConn                        = require("../util/database/database");

/**
 * @class PacienteTomaMedicamentoService
 * @description Clase que contiene los métodos para interactuar con el modelo de PacienteTomaMedicamento.
 */
class PacienteTomaMedicamentoService {
  /**
   * @method createPrescripcion
   * @description Método para crear una prescripción para un paciente.
   * @static
   * @async
   * @memberof PacienteTomaMedicamentoService
   * @param {number} pacienteId - El ID del paciente.
   * @param {Array} prescripciones - Un array de objetos de prescripción.
   * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
   * @returns {Promise<Object>} Un objeto que representa la prescripción creada.
   * @throws {Error} Si ocurre un error durante la creación de la prescripción, se lanza un error.
   */
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

            const toma = await TomaService.createToma(prescripcion, conn);
            const idToma = toma.insertId;
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

  /**
   * @method readTomasByUserId
   * @description Método para leer las tomas de un usuario por su ID.
   * @static
   * @async
   * @memberof PacienteTomaMedicamentoService
   * @param {number} userId - El ID del usuario.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Array>} Un array de tomas.
   * @throws {Error} Si ocurre un error durante la lectura de las tomas, se lanza un error.
   */
  static async readTomasByUserId(userId, conn = dbConn) {
    try {
      return await PacienteTomaMedicamentoModel.findTomasByUserId(userId, conn);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @method findMedicamento
   * @description Método para encontrar un medicamento por su ID de paciente y su ID de medicamento.
   * @static
   * @async
   * @memberof PacienteTomaMedicamentoService
   * @param {number} pacienteId - El ID del paciente.
   * @param {number} medicamentoId - El ID del medicamento.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un objeto que representa el medicamento.
   * @throws {Error} Si ocurre un error durante la búsqueda del medicamento, se lanza un error.
   */
  static async findMedicamento(pacienteId, medicamentoId, conn = dbConn) {
    try {
      return await PacienteTomaMedicamentoModel.findPrescripcion(pacienteId, medicamentoId, conn);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @method findPrescripciones
   * @description Método para encontrar las prescripciones de un paciente por su ID.
   * @static
   * @async
   * @memberof PacienteTomaMedicamentoService
   * @param {number} pacienteId - El ID del paciente.
   * @param {Object} conn - La conexión a la base de datos.
   * @returns {Promise<Object>} Un array de prescripciones.
   * @throws {Error} Si ocurre un error durante la búsqueda de las prescripciones, se lanza un error.
   */
  static async findPrescripciones(pacienteId, conn = dbConn) {
    try {
      return await PacienteTomaMedicamentoModel.findPrescripciones(pacienteId, conn);
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @method deleteTomaFromPrescription
   * @description Método para eliminar una toma de una prescripción por su ID.
   * @static
   * @async
   * @memberof PacienteTomaMedicamentoService
   * @param {number} tomaId - El ID de la toma.
   * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
   * @returns {Promise<void>} No devuelve nada.
   * @throws {Error} Si ocurre un error durante la eliminación de la toma, se lanza un error.
   */
  static async deleteTomaFromPrescription(tomaId, conn = null) {
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

  /**
   * @method deleteMedicamentoFromPrescription
   * @description Método para eliminar un medicamento de una prescripción por su ID de paciente y su ID de medicamento.
   * @static
   * @async
   * @memberof PacienteTomaMedicamentoService
   * @param {number} pacienteId - El ID del paciente.
   * @param {number} medicamentoId - El ID del medicamento.
   * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
   * @returns {Promise<void>} No devuelve nada.
   * @throws {Error} Si ocurre un error durante la eliminación del medicamento, se lanza un error.
   */
  static async deleteMedicamentoFromPrescription(pacienteId, medicamentoId, conn = null) {
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

// Exportación del servicio
module.exports = PacienteTomaMedicamentoService;