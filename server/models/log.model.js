// Importación de las librerías necesarias.
import moment from 'moment-timezone';

/**
 * @class InformeModel
 * @description Clase que contiene los métodos para interactuar con la tabla de informes.
 */
class InformeModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todos los logs.
	 * @static
	 * @async
	 * @memberof InformeModel
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa los informes.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(searchValues, dbConn) {
		const page = searchValues.page;
		const fechaInicio = searchValues.fechaInicio;
		const fechaFin = searchValues.fechaFin;
		const limit = Number(searchValues.limit);
		const offset = (page - 1) * limit;

		const query =
			'SELECT ' +
			'		errno, ' +
			'		sql_state, ' +
			'		error_text, ' +
			'   timestamp ' +
			'FROM ' +
			'		error_log ' +
			'WHERE ' +
			'		timestamp BETWEEN ? AND ? ' +
			'ORDER BY ' +
			'		timestamp DESC ' +
			'LIMIT ? OFFSET ?';

		const countQuery =
			'SELECT ' +
			'		COUNT(*) AS total ' +
			'FROM ' +
			'		error_log ' +
			'WHERE ' +
			'		timestamp BETWEEN ? AND ?';

		try {
			const [rows] = await dbConn.query(query, [fechaInicio, fechaFin, limit, offset]);
			const [count] = await dbConn.query(countQuery, [fechaInicio, fechaFin]);
			const totalLogs = count[0].total;
			const totalPages = Math.ceil(count[0].total / limit);
			const actualPage = page;

			const results = rows.map((row) => {
				return {
					numero_error: row.errno,
					sql_state: row.sql_state,
					message: row.error_text,
					hora: moment.utc(row.timestamp).format('HH:mm:ss'),
					fecha: moment(row.timestamp).format('DD-MM-YYYY')
				};
			});

			return {
				results,
				total: totalLogs,
				totalPages,
				actualPage,
			};
		} catch (err) {
			throw new Error('Error al obtener los logs.');
		}
	}
}

// Exportación del modelo
export default InformeModel;
