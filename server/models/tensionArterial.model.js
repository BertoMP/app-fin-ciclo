// Importación de las librerías necesarias.
import pkg from 'moment-timezone';
const { tz } = pkg;

/**
 * @class TensionArterialModel
 * @description Clase que contiene los métodos para interactuar con la tabla de tension_arterial.
 */
class TensionArterialModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todas las mediciones de tensión arterial de un paciente en un rango de fechas.
	 * @static
	 * @async
	 * @memberof TensionArterialModel
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {number} paciente_id - El ID del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto con las mediciones de tensión arterial y la información de la paginación.
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
			'   sistolica, ' +
			'   diastolica, ' +
			'   pulsaciones_minuto ' +
			'FROM ' +
			'   tension_arterial ' +
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
					'   tension_arterial ' +
					'WHERE ' +
					'   fecha BETWEEN ? AND ? AND ' +
					'   paciente_id = ?',
				[fechaInicio, fechaFin, paciente_id],
			);
			const total = count[0].count;
			const actualPage = page;
			const totalPages = Math.ceil(total / limit);

			rows.forEach((tensionArterial) => {
				tensionArterial.fecha = tz(tensionArterial.fecha, 'Europe/Madrid').format('DD-MM-YYYY');
			});

			return { rows, total, actualPage, totalPages };
		} catch (err) {
			throw new Error('No se pudieron obtener las mediciones de tensión arterial.');
		}
	}

	/**
	 * @method create
	 * @description Método para crear una nueva medición de tensión arterial.
	 * @static
	 * @async
	 * @memberof TensionArterialModel
	 * @param {Object} tensionArterial - El objeto de la nueva medición de tensión arterial.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de inserción.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async create(tensionArterial, dbConn) {
		const paciente_id = tensionArterial.paciente_id;
		const fecha = tensionArterial.fecha;
		const hora = tensionArterial.hora;
		const sistolica = tensionArterial.sistolica;
		const diastolica = tensionArterial.diastolica;
		const pulsaciones_minuto = tensionArterial.pulsaciones;

		const query =
			'INSERT INTO tension_arterial (paciente_id, fecha, hora, sistolica, diastolica, pulsaciones_minuto) ' +
			'   VALUES (?, ?, ?, ?, ?, ?)';

		try {
			return await dbConn.execute(query, [
				paciente_id,
				fecha,
				hora,
				sistolica,
				diastolica,
				pulsaciones_minuto,
			]);
		} catch (err) {
			throw new Error('No se pudo crear la medición de tensión arterial.');
		}
	}

	/**
	 * @method deleteTensionesArterialesByUserId
	 * @description Método para eliminar todas las mediciones de tensión arterial de un paciente.
	 * @static
	 * @async
	 * @memberof TensionArterialModel
	 * @param {number} paciente_id - El ID del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteTensionesArterialesByUserId(paciente_id, dbConn) {
		const query = 'DELETE FROM tension_arterial WHERE paciente_id = ?';
		try {
			return await dbConn.execute(query, [paciente_id]);
		} catch (err) {
			throw new Error('No se pudo eliminar las mediciones de tensión arterial.');
		}
	}
}

// Exportación del modelo
export default TensionArterialModel;
