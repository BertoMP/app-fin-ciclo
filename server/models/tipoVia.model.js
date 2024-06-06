/**
 * @class TipoViaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de tipo_via.
 */
class TipoViaModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todos los tipos de vía.
	 * @static
	 * @async
	 * @memberof TipoViaModel
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de tipos de vía.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(dbConn) {
		const query =
			'SELECT ' +
			' id, ' +
			' nombre ' +
			'FROM ' +
			' tipo_via ' +
			'ORDER BY ' +
			' nombre';

		try {
			const [rows] = await dbConn.execute(query);

			if (!rows.length) {
				return null;
			}

			return rows;
		} catch (err) {
			throw new Error('Error al obtener los tipos de vía.');
		}
	}
}

// Exportación del modelo
export default TipoViaModel;
