// Importación del modelo del servicio
import EspecialidadModel from '../models/especialidad.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";

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
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {number} limit - El límite de especialidades a obtener.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de especialidades.
	 */
	static async readEspecialidades(searchValues, limit, conn = dbConn) {
		return await EspecialidadModel.fetchAll(searchValues, limit, conn);
	}

	/**
	 * @method readEspecialidadesListado
	 * @description Método para leer todas las especialidades en formato de listado.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de especialidades en formato de listado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async readEspecialidadesListado(conn = dbConn) {
		return await EspecialidadModel.fetchAllListado(conn);
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
		try {
			const especialidadesEspecialistas = await EspecialidadModel.fetchAllEspecialidadesEspecialistas(conn);

			if (!especialidadesEspecialistas) {
				throw new Error('No se encontraron especialidades con especialistas.');
			}

			return especialidadesEspecialistas;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method createEspecialidad
	 * @description Método para crear una nueva especialidad.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {Object} data - Los datos de la especialidad.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva especialidad creada.
	 */
	static async createEspecialidad(data, conn = dbConn) {
		const especialidad = ObjectFactory.createEspecialidadObject(data);

		try {
			const especialidadExists = await EspecialidadService.readEspecialidadByNombre(nombreEspecialidad);

			if (especialidadExists) {
				throw new Error('Ya existe una especialidad con ese nombre.');
			}

			return await EspecialidadModel.save(especialidad, conn);
		} catch (err) {
			throw err;
		}
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
	 * @param {Object} data - Los datos de la especialidad.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La especialidad actualizada.
	 */
	static async updateEspecialidad(id, data, conn = dbConn) {
		const especialidad = ObjectFactory.createEspecialidadObject(data);

		try {
			const idExistente = await EspecialidadModel.findById(id, conn);

			if (!idExistente) {
				throw new Error('Especialidad no encontrada.');
			}

			const nombreExistente = await EspecialidadModel.findByNombre(especialidad.nombre, conn);

			if (nombreExistente && nombreExistente.id !== id) {
				throw new Error('Ya existe una especialidad con ese nombre.');
			}

			return await EspecialidadModel.updateById(id, especialidad, conn);
		} catch (err) {
			throw err;
		}
	}
}

// Exportación del servicio
export default EspecialidadService;
