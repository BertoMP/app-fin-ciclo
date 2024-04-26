const PacienteTomaMedicamentoModel = require('../models/pacienteTomaMedicamento.model');
const TomaService = require('./toma.service');
const dbConn = require("../util/database/database");

class PacienteTomaMedicamentoService {
    static async createPrescripcion(pacienteId, prescripciones) {
        const conn = await dbConn.getConnection()

        try {
            await conn.beginTransaction();

            for (const prescripcion of prescripciones) {
                const medicamentoId = prescripcion.medicamento_id;
                const tomas = prescripcion.tomas;

                for (const toma of tomas) {
                    const prescripcion = {
                        dosis: toma.dosis,
                        hora: toma.hora,
                        fecha_inicio: toma.fecha_inicio,
                        fecha_fin: toma.fecha_fin,
                        observaciones: toma.observaciones,
                    }

                    const existingToma = await PacienteTomaMedicamentoModel.findToma(conn, pacienteId, medicamentoId, prescripcion);

                    if (existingToma) {
                        throw new Error('La toma ya existe.');
                    }

                    const idToma = await TomaService.createToma(conn, prescripcion);

                    await PacienteTomaMedicamentoModel.createPacienteTomaMedicamento(conn, pacienteId, medicamentoId, idToma);
                }
            }

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            if (err.message === 'La toma ya existe.') {
                throw new Error('La receta ya existe.');
            }

            throw new Error('Error al guardar la receta.');
        } finally {
            conn.release();
        }
    }

    static async findPrescripciones(pacienteId) {
        try {
            return await PacienteTomaMedicamentoModel.findPrescripciones(dbConn, pacienteId);
        } catch (error) {
            throw new Error('Error al buscar las prescripciones.');
        }
    }
}

module.exports = PacienteTomaMedicamentoService;