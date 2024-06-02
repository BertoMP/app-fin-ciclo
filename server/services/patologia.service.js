// Importación del modelo del servicio
import PatologiaModel from '../models/patologia.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";

/**
 * @class PatologiaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Patologia.
 */
class PatologiaService {
	/**
	 * @method readPatologiasInforme
	 * @description Método para leer todas las patologías de un informe.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de patologías de un informe.
	 */
	static async readPatologiasInforme(conn = dbConn) {
		try {
			const patologias = await PatologiaModel.fetchAllInforme(conn);

			if (!patologias) {
				throw new Error('No se encontraron patologías para el informe.');
			}

			return patologias;
		} catch (err) {
			throw err;
		}

		return await PatologiaModel.fetchAllInforme(conn);
	}

	/**
	 * @method readPatologias
	 * @description Método para leer todas las patologías.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto con patologías.
	 */
	static async readPatologias(searchValues, conn = dbConn) {
		try {
			const page = searchValues.page;
			const limit = searchValues.limit;
			const search = searchValues.search;

			const {
				formattedRows: resultados,
				actualPage: pagina_actual,
				total: cantidad_patologias,
				totalPages: paginas_totales,
			} = await PatologiaModel.fetchAll(searchValues, conn);

			if (page > 1 && page > paginas_totales) {
				return res.status(404).json({
					errors: ['La página de patologías solicitada no existe.'],
				});
			}

			let query = '';

			if (search) {
				query += `&search=${search}`;
			}

			const prev = page > 1 ? `/patologia?page=${page - 1}&limit=${limit}${query}` : null;
			const next = page < paginas_totales ? `/patologia?page=${page + 1}&limit=${limit}${query}` : null;

			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const items_pagina = parseInt(limit);

			return {
				pagina_actual,
				paginas_totales,
				cantidad_patologias,
				result_min,
				result_max,
				items_pagina,
				prev,
				next,
				resultados,
			};
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readPatologiaById
	 * @description Método para leer una patología por su ID.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {number} id - El ID de la patología.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La patología.
	 */
	static async readPatologiaById(id, conn = dbConn) {
		try {
			const patologia = await PatologiaModel.findById(id, conn);

			if (!patologia) {
				throw new Error('La patología solicitada no existe.');
			}

			return patologia;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readPatologiaByNombre
	 * @description Método para leer una patología por su nombre.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {string} nombre - El nombre de la patología.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La patología.
	 */
	static async readPatologiaByNombre(nombre, conn = dbConn) {
		return await PatologiaModel.findByNombre(nombre, conn);
	}

	/**
	 * @method createPatologia
	 * @description Método para crear una nueva patología.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {Object} data - El objeto de la nueva patología.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<void>} No devuelve nada.
	 */
	static async createPatologia(data, conn = dbConn) {
		try {
			console.log(data.descripcion);
			const patologia = ObjectFactory.createPatologiaObject(data);
			console.log(patologia.descripcion);
			const patologiaExists = await PatologiaModel.findByNombre(patologia.nombre, conn);

			if (patologiaExists) {
				throw new Error('La patología ya existe.');
			}

			return await PatologiaModel.save(patologia, conn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method updatePatologia
	 * @description Método para actualizar una patología por su ID.
	 * @static
	 * @async
	 * @memberof PatologiaService
	 * @param {number} id - El ID de la patología.
	 * @param {Object} data - El objeto de la patología con los datos actualizados.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<void>} No devuelve nada.
	 */
	static async updatePatologia(id, data, conn = dbConn) {
		try {
			const patologia = ObjectFactory.createPatologiaObject(data);
			const patologiaExists = await PatologiaModel.findById(id, conn);

			if (!patologiaExists) {
				throw new Error('La patología solicitada no existe.');
			}

			const patologiaNombreExists = await PatologiaModel.findByNombre(patologia.nombre, conn);

			if (patologiaNombreExists && patologiaNombreExists.id !== id) {
				throw new Error('Ya existe una patología con el mismo nombre.');
			}

			return await PatologiaModel.updateById(id, patologia, conn);
		} catch (err) {
			throw err;
		}
	}
}

// Exportación del servicio
export default PatologiaService;
