// Importación del modelo del servicio
import ConsultaModel from '../models/consulta.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import EspecialistaService from "./especialista.service.js";

/**
 * @class ConsultaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Consulta.
 */
class ConsultaService {
	/**
	 * @method readConsultas
	 * @description Método para leer consultas.
	 * @static
	 * @async
	 * @memberOf ConsultaService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de consultas.
	 */
	static async readConsultas(searchValues, conn = dbConn) {
		try {
			const search = searchValues.search;
			const page = searchValues.page;
			const limit = searchValues.limit;

			const {
				rows: resultados,
				total: cantidad_consultas,
				actualPage: pagina_actual,
				totalPages: paginas_totales,
			} = await ConsultaModel.findAll(searchValues, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página solicitada no existe.');
			}

			const prev = page > 1 ? `/consulta?page=${page - 1}&search=${search}&limit=${limit}` : null;
			const next = page < paginas_totales ? `/consulta?page=${page + 1}&search=${search}&limit=${limit}` : null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const items_pagina = parseInt(limit);

			return {
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_consultas,
				result_min,
				result_max,
				items_pagina,
				resultados,
			};
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readConsultasListado
	 * @description Método para leer consultas.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de consultas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async readConsultasListado(conn = dbConn) {
		try {
			const consultaListado = await ConsultaModel.findAllListado(conn);

			if (!consultaListado) {
				throw new Error('No se encontraron consultas.');
			}

			return consultaListado;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readConsultaById
	 * @description Método para leer una consulta por su ID.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta.
	 */
	static async readConsultaById(id, conn = dbConn) {
		try {
			const consulta = await ConsultaModel.findById(id, conn);

			if (!consulta) {
				throw new Error('Consulta no encontrada.');
			}

			return consulta;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method createConsulta
	 * @description Método para crear una consulta.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {Object} consulta - Los datos de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta creada.
	 */
	static async createConsulta(consulta, conn = dbConn) {
		try {
			const consultaExists = await ConsultaModel.findByName(consulta.nombre, conn);

			if (consultaExists) {
				throw new Error('La consulta ya existe.');
			}

			return await ConsultaModel.createConsulta(consulta, conn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method updateConsulta
	 * @description Método para actualizar una consulta.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} consulta - Los nuevos datos de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta actualizada.
	 */
	static async updateConsulta(id, consulta, conn = dbConn) {
		try {
			const idExists = await ConsultaModel.findById(id, conn);

			if (!idExists) {
				throw new Error('La consulta no existe.');
			}

			const nombreExists = await ConsultaModel.findByName(consulta.nombre, conn);

			if (nombreExists && nombreExists.id !== id) {
				throw new Error('Ya existe una consulta con ese nombre.');
			}

			return await ConsultaModel.updateConsulta(id, consulta, conn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method deleteConsulta
	 * @description Método para eliminar una consulta.
	 * @static
	 * @async
	 * @memberof ConsultaService
	 * @param {number} id - El ID de la consulta.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa la consulta eliminada.
	 */
	static async deleteConsulta(id, conn = dbConn) {
		try {
			const consulta = await ConsultaModel.findById(id, conn);

			if (!consulta) {
				throw new Error('La consulta no existe.');
			}

			const especialistasAsociados = consulta.medicos_asociados.length > 0;

			if (especialistasAsociados) {
				throw new Error('No se puede eliminar la consulta porque está asociada a un médico.');
			}

			return await ConsultaModel.deleteConsulta(id, conn);
		} catch (err) {
			throw err;
		}
	}
}

// Exportación del servicio
export default ConsultaService;
