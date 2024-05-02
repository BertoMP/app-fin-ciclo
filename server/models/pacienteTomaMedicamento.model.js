// Importación de las librerías necesarias.
import { format } from 'date-fns';

/**
 * @class PacienteTomaMedicamentoModel
 * @description Clase que contiene los métodos para interactuar con la tabla de paciente_toma_medicamento.
 */
class PacienteTomaMedicamentoModel {
	/**
	 * @method findPrescripciones
	 * @description Método para obtener las prescripciones de un paciente.
	 * @static
	 * @async
	 * @memberof PacienteTomaMedicamentoModel
	 * @param {number} pacienteId - El ID del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto con los datos del paciente y sus prescripciones.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findPrescripciones(pacienteId, dbConn) {
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
				prescripciones: [],
			};

			for (const row of rows) {
				if (!result.datos_paciente.id) {
					result.datos_paciente = {
						id: row.paciente_id,
						nombre: row.nombre,
						primer_apellido: row.primer_apellido,
						segundo_apellido: row.segundo_apellido,
						num_historia_clinica: row.num_historia_clinica,
					};
				}

				let prescripcion = result.prescripciones.find(
					(prescripcion) => prescripcion.medicamento.id === row.medicamento_id,
				);

				if (!prescripcion) {
					prescripcion = {
						medicamento: {
							id: row.medicamento_id,
							nombre: row.medicamento_nombre,
							descripcion: row.descripcion,
							tomas: [],
						},
					};

					result.prescripciones.push(prescripcion);
				}

				prescripcion.medicamento.tomas.push({
					id: row.toma_id,
					hora: format(new Date(`1970-01-01T${row.hora}Z`), 'HH:mm'),
					dosis: row.dosis,
					fecha_inicio: format(new Date(row.fecha_inicio), 'dd-MM-yyyy'),
					fecha_fin: row.fecha_fin ? format(new Date(row.fecha_fin), 'dd-MM-yyyy') : null,
					observaciones: row.observaciones,
				});
			}

			return result;
		} catch (error) {
			throw new Error('Error al buscar las prescripciones.');
		}
	}

	/**
	 * @method createPacienteTomaMedicamento
	 * @description Método para crear una nueva entrada en la tabla paciente_toma_medicamento.
	 * @static
	 * @async
	 * @memberof PacienteTomaMedicamentoModel
	 * @param {number} pacienteId - El ID del paciente.
	 * @param {number} medicamentoId - El ID del medicamento.
	 * @param {number} tomaId - El ID de la toma.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de inserción.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createPacienteTomaMedicamento(pacienteId, medicamentoId, tomaId, dbConn) {
		const query =
			'INSERT INTO paciente_toma_medicamento (paciente_id, medicamento_id, toma_id) ' +
			'   VALUES (?, ?, ?)';

		try {
			return await dbConn.execute(query, [pacienteId, medicamentoId, tomaId]);
		} catch (error) {
			throw new Error('Error al guardar la receta.');
		}
	}

	/**
	 * @method findPrescripcion
	 * @description Método para obtener las tomas de un paciente para un medicamento específico.
	 * @static
	 * @async
	 * @memberof PacienteTomaMedicamentoModel
	 * @param {number} pacienteId - El ID del paciente.
	 * @param {number} medicamentoId - El ID del medicamento.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de IDs de tomas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findPrescripcion(pacienteId, medicamentoId, dbConn) {
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

			return rows.map((row) => row.toma_id);
		} catch (error) {
			throw new Error('Error al buscar la prescripción.');
		}
	}

	/**
	 * @method updateToma
	 * @description Método para actualizar una toma.
	 * @static
	 * @async
	 * @memberof PacienteTomaMedicamentoModel
	 * @param {number} idToma - El ID de la toma.
	 * @param {Object} prescripcion - El objeto de la prescripción con los datos actualizados.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de actualización.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateToma(idToma, prescripcion, dbConn) {
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
			return await dbConn.execute(query, [
				dosis,
				hora,
				fecha_inicio,
				fecha_fin,
				observaciones,
				idToma,
			]);
		} catch (error) {
			throw new Error('Error al actualizar la toma.');
		}
	}

	/**
	 * @method deleteToma
	 * @description Método para eliminar una toma.
	 * @static
	 * @async
	 * @memberof PacienteTomaMedicamentoModel
	 * @param {number} idToma - El ID de la toma.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteToma(idToma, dbConn) {
		const query = 'DELETE ' + 'FROM paciente_toma_medicamento ' + 'WHERE toma_id = ?';

		try {
			return await dbConn.execute(query, [idToma]);
		} catch (error) {
			throw new Error('Error al eliminar la toma.');
		}
	}

	/**
	 * @method findTomasByUserId
	 * @description Método para obtener las tomas de un paciente.
	 * @static
	 * @async
	 * @memberof PacienteTomaMedicamentoModel
	 * @param {number} pacienteId - El ID del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de IDs de tomas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findTomasByUserId(pacienteId, dbConn) {
		const query =
			'SELECT ' +
			'   toma_id ' +
			'FROM ' +
			'   paciente_toma_medicamento ' +
			'WHERE ' +
			'   paciente_id = ?';

		try {
			const [rows] = await dbConn.execute(query, [pacienteId]);

			return rows.map((row) => row.toma_id);
		} catch (error) {
			throw new Error('Error al buscar las tomas.');
		}
	}

	/**
	 * @method findTomaByHora
	 * @description Método para obtener una toma de un paciente para un medicamento específico a una hora específica.
	 * @static
	 * @async
	 * @memberof PacienteTomaMedicamentoModel
	 * @param {number} pacienteId - El ID del paciente.
	 * @param {number} medicamentoId - El ID del medicamento.
	 * @param {string} hora - La hora de la toma.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La toma.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findTomaByHora(pacienteId, medicamentoId, hora, dbConn) {
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

// Exportación del modelo
export default PacienteTomaMedicamentoModel;
