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
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de especialidades.
	 */
	static async readEspecialidades(searchValues, conn = dbConn) {
		try {
			const page = searchValues.page;
			const limit = searchValues.limit;
			const search = searchValues.search;

			const {
				formattedRows: resultados,
				total: cantidad_especialidades,
				actualPage: pagina_actual,
				totalPages: paginas_totales,
			} = await EspecialidadModel.fetchAll(searchValues, limit, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página solicitada no existe.');
			}

			let query = '';

			if (search) {
				query += `&search=${search}`;
			}

			const prev = page > 1 ? `/especialidad?page=${page - 1}&limit=${limit}${query}` : null;
			const next = page < paginas_totales ? `/especialidad?page=${page + 1}&limit=${limit}${query}` : null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const items_pagina = parseInt(limit);

			return {
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_especialidades,
				items_pagina,
				result_min,
				result_max,
				resultados,
			};
		} catch (err) {
			throw err;
		}
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
		try {
			const resultados = await EspecialidadModel.fetchAllListado(conn);

			if (!resultados) {
				throw new Error('No se encontraron especialidades.');
			}

			return resultados;
		} catch (err) {
			throw err;
		}
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
		try {
			const especialidad = await EspecialidadModel.findById(id, conn);

			if (!especialidad) {
				throw new Error('Especialidad no encontrada.');
			}

			return especialidad;
		} catch (err) {
			throw err;
		}
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
	 * @method readEspecialidadByEspecialistaId
	 * @description Método para leer una especialidad por el ID de un especialista.
	 * @static
	 * @async
	 * @memberof EspecialidadService
	 * @param {number} id - El ID del especialista.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La especialidad.
	 */
	static async readEspecialidadByEspecialistaId(id, conn = dbConn) {
		try {
			const especialidad = await EspecialidadModel.getEspecialidadByEspecialistaId(id, conn);

			if (!especialidad) {
				throw new Error('Especialidad no encontrada.');
			}

			return especialidad;
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
			const especialidadExists = await EspecialidadModel.findByNombre(especialidad.nombre, conn);

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
		try {
			const idExistente = await EspecialidadModel.findById(id, conn);

			if (!idExistente) {
				throw new Error('Especialidad no encontrada.');
			}

			return await EspecialidadModel.deleteById(id, conn);
		} catch (err) {
			throw err;
		}
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
