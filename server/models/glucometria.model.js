// Importación de las librerías necesarias.
import pkg from 'moment-timezone';
const { tz } = pkg;

/**
 * @class GlucometriaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de glucometria.
 */
class GlucometriaModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todas las mediciones de glucosa de un paciente en un rango de fechas.
	 * @static
	 * @async
	 * @memberof GlucometriaModel
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {number} paciente_id - El ID del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto con las mediciones de glucosa y la información de la paginación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(searchValues, paciente_id, dbConn) {
		const page = searchValues.page;
		const fechaInicio = searchValues.fechaInicio;
		const fechaFin = searchValues.fechaFin;
		const limit = searchValues.limit;
		const offset = (page - 1) * limit;

		const query =
			'SELECT ' +
			'   fecha, ' +
			'   hora, ' +
			'   medicion ' +
			'FROM ' +
			'   glucometria ' +
			'WHERE ' +
			'   fecha BETWEEN ? AND ? AND ' +
			'   paciente_id = ? ' +
			'ORDER BY ' +
			'   fecha DESC, ' +
			'   hora DESC ' +
			'LIMIT ? OFFSET ?';

		try {
			const [rows] = await dbConn.execute(query, [
				fechaInicio,
				fechaFin,
				paciente_id,
				`${limit}`,
				`${offset}`,
			]);

			const [count] = await dbConn.execute(
				'SELECT ' +
					'   COUNT(*) AS count ' +
					'FROM ' +
					'   glucometria ' +
					'WHERE ' +
					'   fecha BETWEEN ? AND ? AND ' +
					'   paciente_id = ?',
				[fechaInicio, fechaFin, paciente_id],
			);
			const total = count[0].count;
			const actualPage = page;
			const totalPages = Math.ceil(total / limit);

			rows.forEach((glucometria) => {
				glucometria.fecha = tz(glucometria.fecha, 'Europe/Madrid').format('DD-MM-YYYY');
			});

			return { rows, total, actualPage, totalPages };
		} catch (err) {
			throw new Error('No se pudieron obtener las mediciones de glucosa.');
		}
	}

	/**
	 * @method create
	 * @description Método para crear una nueva medición de glucosa.
	 * @static
	 * @async
	 * @memberof GlucometriaModel
	 * @param {Object} glucometria - El objeto de la nueva medición de glucosa.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de inserción.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async create(glucometria, dbConn) {
		const paciente_id = glucometria.paciente_id;
		const fecha = glucometria.fecha;
		const hora = glucometria.hora;
		const medicion = glucometria.medicion;

		const query =
			'INSERT INTO glucometria (paciente_id, fecha, hora, medicion) VALUES (?, ?, ?, ?)';

		try {
			return await dbConn.execute(query, [paciente_id, fecha, hora, medicion]);
		} catch (err) {
			throw new Error('No se pudo crear la medición de glucosa.');
		}
	}

	/**
	 * @method deleteGlucometriasByUserId
	 * @description Método para eliminar todas las mediciones de glucosa de un paciente.
	 * @static
	 * @async
	 * @memberof GlucometriaModel
	 * @param {number} paciente_id - El ID del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteGlucometriasByUserId(paciente_id, dbConn) {
		const query = 'DELETE FROM glucometria WHERE paciente_id = ?';
		try {
			return await dbConn.execute(query, [paciente_id]);
		} catch (err) {
			throw new Error('No se pudieron eliminar las mediciones de glucosa.');
		}
	}
}

// Exportación del modelo
export default GlucometriaModel;
