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

    static async deleteToma(tomaId) {
        const conn = await dbConn.getConnection();

        try {
            await conn.beginTransaction();

            await PacienteTomaMedicamentoModel.deleteToma(conn, tomaId);

            await TomaService.deleteToma(conn, tomaId);

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw new Error('Error al eliminar la toma.');
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
        } catch (error) {
            await conn.rollback();
            throw new Error('Error al eliminar el medicamento.');
        }
    }
}

module.exports = PacienteTomaMedicamentoService;