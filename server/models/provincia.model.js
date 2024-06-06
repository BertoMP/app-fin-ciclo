/**
 * @class ProvinciaModel
 * @description Clase que contiene los métodos para interactuar con la tabla de provincias.
 */
class ProvinciaModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todas las provincias.
	 * @static
	 * @async
	 * @memberof ProvinciaModel
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de provincias.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(dbConn) {
		const query =
			'SELECT ' +
			' id, ' +
			' nombre ' +
			'FROM ' +
			' provincia ' +
			'ORDER BY ' +
			' nombre';

		try {
			const [rows] = await dbConn.execute(query);

			if (!rows.length) {
				return null;
			}

			return rows;
		} catch (err) {
			throw new Error('Error al obtener las provincias.');
		}
	}
}

// Exportación del modelo
export default ProvinciaModel;
