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
	 * @returns {Promise<number>} El ID de la nueva toma creada.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createToma(prescripcion, dbConn) {
		const dosis = prescripcion.dosis;
		const hora = prescripcion.hora;
		const fecha_inicio = prescripcion.fecha_inicio;
		const fecha_fin = prescripcion.fecha_fin ?? null;
		const observaciones = prescripcion.observaciones ?? null;

		const query =
			'INSERT INTO toma (dosis, hora, fecha_inicio, fecha_fin, observaciones) ' +
			'   VALUES (?, ?, ?, ?, ?)';

		try {
			const result = await dbConn.execute(query, [
				dosis,
				hora,
				fecha_inicio,
				fecha_fin,
				observaciones,
			]);

			return result[0];
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
		const query = 'DELETE FROM toma WHERE id = ?';

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
		const query = 'SELECT * FROM toma WHERE id = ?';

		try {
			const result = await dbConn.execute(query, [id]);

			return result[0];
		} catch (err) {
			throw new Error('Error al buscar la toma.');
		}
	}
}

export default TomaModel;
