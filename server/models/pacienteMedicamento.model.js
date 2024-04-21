class PacienteMedicamentoModel {
    static async fetchAll(dbConn, id) {
        const patientQuery = 'SELECT nombre, primer_apellido, segundo_apellido FROM usuario WHERE id = ?';
        const medicamentQuery =
            'SELECT ' +
            'paciente_medicamento.medicamento_id AS medicamento_id, ' +
            'medicamento.nombre AS medicamento_nombre, ' +
            'medicamento.descripcion AS medicamento_descripcion, ' +
            'paciente_medicamento.toma_diurna AS toma_diurna, ' +
            'paciente_medicamento.toma_vespertina AS toma_vespertina, ' +
            'paciente_medicamento.toma_nocturna AS toma_nocturna ' +
            'FROM paciente_medicamento ' +
            'INNER JOIN medicamento ON medicamento.id = paciente_medicamento.medicamento_id ' +
            'WHERE paciente_id = ?';
        try {
            const [patientRows] = await dbConn.execute(patientQuery, [id]);
            const [medicamentRows] = await dbConn.execute(medicamentQuery, [id]);

            const datos_paciente = {
                paciente_id: id,
                nombre: patientRows[0].nombre,
                primer_apellido: patientRows[0].primer_apellido,
                segundo_apellido: patientRows[0].segundo_apellido
            };
            const medicacion_asociada = medicamentRows.map(row => ({
                medicamento_id: row.medicamento_id,
                nombre: row.medicamento_nombre,
                descripcion: row.medicamento_descripcion,
                pauta: {
                    toma_diurna: row.toma_diurna,
                    toma_vespertina: row.toma_vespertina,
                    toma_nocturna: row.toma_nocturna
                }
            }));
            return { datos_paciente, medicacion_asociada };
        } catch (err) {
            throw new Error('No se pudieron obtener los medicamentos del paciente.');
        }
    }

    static async findMedicamentoInPaciente(dbConn, paciente_id, medicamento_id) {
        const query =
            'SELECT * FROM paciente_medicamento ' +
            'WHERE paciente_id = ? AND medicamento_id = ?';
        try {
            const [rows] = await dbConn.execute(query, [paciente_id, medicamento_id]);
            return rows;
        } catch (err) {
            throw new Error('No se pudo encontrar el medicamento en la receta del paciente.');
        }
    }

    static async create(dbConn, medicamentoPaciente) {
        const medicamento_id = medicamentoPaciente.medicamento_id;
        const paciente_id = medicamentoPaciente.paciente_id;
        const toma_diurna = medicamentoPaciente.toma_diurna;
        const toma_vespertina = medicamentoPaciente.toma_vespertina;
        const toma_nocturna = medicamentoPaciente.toma_nocturna;

        const query =
            'INSERT INTO paciente_medicamento (medicamento_id, paciente_id, toma_diurna, toma_vespertina, toma_nocturna) ' +
            'VALUES (?, ?, ?, ?, ?)';

        try {
            await dbConn.execute(query, [medicamento_id, paciente_id, toma_diurna, toma_vespertina, toma_nocturna]);
        } catch (err) {
            throw new Error('No se pudo añadir el medicamento a la receta del paciente.');
        }
    }

    static async update(dbConn, medicamentoPaciente) {
        const paciente_id = medicamentoPaciente.paciente_id;
        const medicamento_id = medicamentoPaciente.medicamento_id;
        const toma_diurna = medicamentoPaciente.toma_diurna;
        const toma_vespertina = medicamentoPaciente.toma_vespertina;
        const toma_nocturna = medicamentoPaciente.toma_nocturna;

        const query =
            'UPDATE paciente_medicamento ' +
            'SET toma_diurna = ?, toma_vespertina = ?, toma_nocturna = ? ' +
            'WHERE paciente_id = ? AND medicamento_id = ?';

        try {
            await dbConn.execute(query, [toma_diurna, toma_vespertina, toma_nocturna, paciente_id, medicamento_id]);
        } catch (err) {
            throw new Error('No se pudo actualizar la receta del paciente.');
        }
    }

    static async delete(dbConn, pacienteMedicamento) {
        const paciente_id = pacienteMedicamento.paciente_id;
        const medicamento_id = pacienteMedicamento.medicamento_id;

        const query =
            'DELETE FROM paciente_medicamento ' +
            'WHERE paciente_id = ? AND medicamento_id = ?';

        try {
            await dbConn.execute(query, [paciente_id, medicamento_id]);
        } catch (err) {
            throw new Error('No se pudo eliminar el medicamento de la receta del paciente.');
        }
    }

    static async deleteMedicamentosByUserId(dbConn, paciente_id) {
        const query =
            'DELETE FROM paciente_medicamento WHERE paciente_id = ?';

        try {
            await dbConn.execute(query, [paciente_id]);
        } catch (err) {
            throw new Error('No se pudieron eliminar los medicamentos de la receta del paciente.');
        }
    }
}

module.exports = PacienteMedicamentoModel;