import {format} from "date-fns";

/**
 * @class TomaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de toma.
 */
class TomaModel {
	/**
	 * @method createToma
	 * @description Método para crear una nueva toma.
	 * @static
	 * @async
	 * @memberof TomaModel
	 * @param {Object} prescripcion - El objeto de la nueva prescripción.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<{id: number, datos_toma: {fecha_inicio: *, hora: *, fecha_fin: *, dosis: *, observaciones: *}}>} El ID de la nueva toma creada.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createToma(prescripcion, dbConn) {
		const dosis = prescripcion.dosis;
		const hora = prescripcion.hora;
		const [day, month, year] = prescripcion.fecha_inicio.split('-');
		const fecha_inicio = `${year}-${month}-${day}`;
		let fecha_fin = null;

		if (prescripcion.fecha_fin) {
			const [day_fin, month_fin, year_fin] = prescripcion.fecha_fin.split('-');
			fecha_fin = `${year_fin}-${month_fin}-${day_fin}`;
		}

		const observaciones = prescripcion.observaciones ?? null;

		const query =
			'INSERT INTO toma (dosis, hora, fecha_inicio, fecha_fin, observaciones) ' +
			' VALUES (?, ?, ?, ?, ?)';

		try {
			const result = await dbConn.execute(query, [
				dosis,
				hora,
				fecha_inicio,
				fecha_fin,
				observaciones,
			]);

			return {
				id: result[0].insertId,
				datos_toma: {
					dosis: dosis,
					hora: hora,
					fecha_inicio: fecha_inicio,
					fecha_fin: fecha_fin,
					observaciones: observaciones,
				}
			}
		} catch (err) {
			throw new Error('Error al guardar la toma.');
		}
	}

	/**
	 * @method deleteToma
	 * @description Método para eliminar una toma por su ID.
	 * @static
	 * @async
	 * @memberof TomaModel
	 * @param {number} id - El ID de la toma.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteToma(id, dbConn) {
		const query =
			'DELETE ' +
			'FROM ' +
			' toma ' +
			'WHERE ' +
			' id = ?';

		try {
			return await dbConn.execute(query, [id]);
		} catch (err) {
			throw new Error('Error al eliminar la toma.');
		}
	}

	/**
	 * @method findToma
	 * @description Método para buscar una toma por su ID.
	 * @static
	 * @async
	 * @memberof TomaModel
	 * @param {number} id - El ID de la toma.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La toma encontrada.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findToma(id, dbConn) {
		const query =
			'SELECT ' +
			' id, ' +
			' hora,' +
			' dosis,' +
			' fecha_inicio,' +
			' fecha_fin,' +
			' observaciones, ' +
			' medicamento_id ' +
			'FROM ' +
			'	toma ' +
			'INNER JOIN ' +
			'	paciente_toma_medicamento ON toma.id = paciente_toma_medicamento.toma_id ' +
			'WHERE ' +
			'	id = ?';

		try {
			const [rows] = await dbConn.execute(query, [id]);

			if (rows.length === 0) {
				return null;
			}

			return {
				datos_toma: {
					id: rows[0].id,
					dosis: rows[0].dosis,
					hora: rows[0].hora,
					fecha_inicio: format(new Date(rows[0].fecha_inicio), 'dd-MM-yyyy'),
					fecha_fin: rows[0].fecha_fin ? format(new Date(rows[0].fecha_fin), 'dd-MM-yyyy') : null,
					observaciones: rows[0].observaciones,
				},
				id: rows[0].medicamento_id,
			};
		} catch (err) {
			throw new Error('Error al buscar la toma.');
		}
	}

	/**
	 * @method deleteAllTomas
	 * @description Método para eliminar todas las tomas de un paciente.
	 * @static
	 * @async
	 * @memberof TomaModel
	 * @param {Array} tomas - El arreglo con los IDs de las tomas.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteAllTomas(tomas, dbConn) {
		const placeholder = tomas.map(() => '?').join(', ');
		const query =
			'DELETE ' +
			'FROM ' +
			' toma ' +
			'WHERE ' +
			` id IN (${placeholder})`;

		try {
			return await dbConn.execute(query, [...tomas]);
		} catch (err) {
			throw new Error('Error al eliminar las tomas.');
		}
	}
}

export default TomaModel;
