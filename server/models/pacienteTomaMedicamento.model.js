const { format } = require('date-fns');

class PacienteTomaMedicamentoModel {
    static async createPacienteTomaMedicamento(dbConn, pacienteId, medicamentoId, tomaId) {
        const query = 'INSERT INTO paciente_toma_medicamento (paciente_id, medicamento_id, toma_id) VALUES (?, ?, ?)';

        try {
            await dbConn.execute(query, [pacienteId, medicamentoId, tomaId]);
        } catch (error) {
            throw new Error('Error al guardar la receta.');
        }
    }

    static async findToma(dbConn, pacienteId, medicamentoId, prescripcion) {
        const dosis = prescripcion.dosis;
        const hora = prescripcion.hora;
        const fecha_inicio = prescripcion.fecha_inicio;

        const query =
            'SELECT toma_id FROM paciente_toma_medicamento ' +
            'INNER JOIN toma ON paciente_toma_medicamento.toma_id = toma.id ' +
            'INNER JOIN medicamento ON paciente_toma_medicamento.medicamento_id = medicamento.id ' +
            'WHERE paciente_id = ? ' +
            '   AND medicamento_id = ? ' +
            '   AND dosis = ? ' +
            '   AND hora = ? ' +
            '   AND fecha_inicio = ?';

        try {
            const result = await dbConn.execute(query, [pacienteId, medicamentoId, dosis, hora, fecha_inicio]);

            return result[0][0];
        } catch (error) {
            throw new Error('Error al buscar la toma.');
        }
    }

    static async findPrescripciones(dbConn, pacienteId) {
        const query =
            "SELECT " +
            "   usuario.id as pacienteID, " +
            "   usuario.nombre, " +
            "   usuario.primer_apellido, " +
            "   usuario.segundo_apellido, " +
            "   paciente.num_historia_clinica, " +
            "   medicamento.id as medicamentoID, " +
            "   medicamento.nombre as medicamentoNombre, " +
            "   medicamento.descripcion, " +
            "   toma.id as tomaID, " +
            "   toma.hora, " +
            "   toma.dosis, " +
            "   toma.fecha_inicio, " +
            "   toma.fecha_fin, " +
            "   toma.observaciones " +
            "FROM " +
            "   paciente_toma_medicamento " +
            "INNER JOIN " +
            "   paciente on paciente.usuario_id = paciente_toma_medicamento.paciente_id " +
            "INNER JOIN " +
            "   usuario on usuario.id = paciente.usuario_id " +
            "INNER JOIN " +
            "   medicamento on medicamento.id = paciente_toma_medicamento.medicamento_id " +
            "INNER JOIN " +
            "   toma on toma.id = paciente_toma_medicamento.toma_id " +
            "WHERE " +
            "   usuario.id = ?";

        try {
            const [rows] = await dbConn.execute(query, [pacienteId]);

            const result = {};
            for (const row of rows) {
                if (!result[row.pacienteID]) {
                    result[row.pacienteID] = {
                        paciente: {
                            pacienteID: row.pacienteID,
                            nombre: row.nombre,
                            primer_apellido: row.primer_apellido,
                            segundo_apellido: row.segundo_apellido,
                            num_historia_clinica: row.num_historia_clinica
                        },
                        prescripcion: {}
                    };
                }

                if (!result[row.pacienteID].prescripcion[row.medicamentoID]) {
                    result[row.pacienteID].prescripcion[row.medicamentoID] = {
                        medicamentoId: row.medicamentoID,
                        nombre: row.medicamentoNombre,
                        descripcion: row.descripcion,
                        tomas: []
                    };
                }

                result[row.pacienteID].prescripcion[row.medicamentoID].tomas.push({
                    tomaID: row.tomaID,
                    hora: row.hora,
                    dosis: row.dosis,
                    fecha_inicio: format(new Date(row.fecha_inicio), 'dd-MM-yyyy'),
                    fecha_fin: row.fecha_fin ? format(new Date(row.fecha_fin), 'dd-MM-yyyy') : null,
                    observaciones: row.observaciones
                });
            }

            return Object.values(result).map(paciente => ({
                paciente: paciente.paciente,
                prescripcion: Object.values(paciente.prescripcion)
            }));
        } catch (error) {
            throw new Error('Error al buscar las prescripciones.');
        }
    }
}

module.exports = PacienteTomaMedicamentoModel;