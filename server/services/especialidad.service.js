// Importación del modelo del servicio
import EspecialidadModel from '../models/especialidad.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';

/**
 * @class EspecialidadService
 * @description Clase que contiene los métodos para interactuar con el modelo de Especialidad.
 */
class EspecialidadService {
	/**
	 * @method readEspecialidades
	 * @description Método para leer todas las especialidades.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {number} page - La página de resultados a devolver.
	 * @param {number} limit - El número de resultados por página.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de especialidades.
	 */
	static async readEspecialidades(page, limit, conn = dbConn) {
		return await EspecialidadModel.fetchAll(page, limit, conn);
	}

	/**
	 * @method readEspecialidadById
	 * @description Método para leer una especialidad por su ID.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {number} id - El ID de la especialidad.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La especialidad.
	 */
	static async readEspecialidadById(id, conn = dbConn) {
		return await EspecialidadModel.findById(id, conn);
	}

	/**
	 * @method readEspecialidadByNombre
	 * @description Método para leer una especialidad por su nombre.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {string} nombre - El nombre de la especialidad.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La especialidad.
	 */
	static async readEspecialidadByNombre(nombre, conn = dbConn) {
		return await EspecialidadModel.findByNombre(nombre, conn);
	}

	/**
	 * @method readEspecialidesEspecialistas
	 * @description Método para leer todas las especialidades y sus especialistas.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de especialidades y sus especialistas.
	 */
	static async readEspecialidesEspecialistas(conn = dbConn) {
		return await EspecialidadModel.fetchAllEspecialidadesEspecialistas(conn);
	}

	/**
	 * @method createEspecialidad
	 * @description Método para crear una nueva especialidad.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {Object} especialidad - El objeto de la nueva especialidad.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva especialidad creada.
	 */
	static async createEspecialidad(especialidad, conn = dbConn) {
		return await EspecialidadModel.save(especialidad, conn);
	}

	/**
	 * @method deleteEspecialidad
	 * @description Método para eliminar una especialidad por su ID.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {number} id - El ID de la especialidad.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deleteEspecialidad(id, conn = dbConn) {
		return await EspecialidadModel.deleteById(id, conn);
	}

	/**
	 * @method updateEspecialidad
	 * @description Método para actualizar una especialidad por su ID.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {number} id - El ID de la especialidad.
	 * @param {Object} especialidad - El objeto de la especialidad con los datos actualizados.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La especialidad actualizada.
	 */
	static async updateEspecialidad(id, especialidad, conn = dbConn) {
		return await EspecialidadModel.updateById(id, especialidad, conn);
	}
}

// Exportación del servicio
export default EspecialidadService;
