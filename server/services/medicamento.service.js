// Importación del modelo del servicio
import MedicamentoModel from '../models/medicamento.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";

/**
 * @class MedicamentoService
 * @description Clase que contiene los métodos para interactuar con el modelo de Medicamento.
 */
class MedicamentoService {
	/**
	 * @method readMedicamentosPrescripcion
	 * @description Método para leer todos los medicamentos de prescripción.
	 * @static
	 * @async
	 * @memberof MedicamentoService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de medicamentos de prescripción.
	 */
	static async readMedicamentosPrescripcion(conn = dbConn) {
		try {
			const medicamentos = await MedicamentoModel.fetchAllPrescripcion(conn);

			if (!medicamentos) {
				throw new Error('No se encontraron medicamentos.');
			}

			return medicamentos;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readMedicamentos
	 * @description Método para leer todos los medicamentos.
	 * @static
	 * @async
	 * @memberof MedicamentoService
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de medicamentos.
	 */
	static async readMedicamentos(searchValues, conn = dbConn) {
		try {
			const page = searchValues.page;
			const limit = searchValues.limit;
			const search = searchValues.search;

			const {
				formattedRows: resultados,
				actualPage: pagina_actual,
				total: cantidad_medicamentos,
				totalPages: paginas_totales,
			} = await MedicamentoModel.fetchAll(searchValues, conn);


			if (page > 1 && page > paginas_totales) {
				throw new Error('Página no encontrada.');
			}

			let query = '';

			if (search) {
				query += `&search=${search}`;
			}

			const prev = page > 1 ? `/medicamento?page=${page - 1}&limit=${limit}${query}` : null;
			const next = page < paginas_totales ? `/medicamento?page=${page + 1}&limit=${limit}${query}` : null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const items_pagina = parseInt(limit);

			return{
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_medicamentos,
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
	 * @method readMedicamentoById
	 * @description Método para leer un medicamento por su ID.
	 * @static
	 * @async
	 * @memberof MedicamentoService
	 * @param {number} id - El ID del medicamento.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El medicamento.
	 */
	static async readMedicamentoById(id, conn = dbConn) {
		try {
			const medicamento = await MedicamentoModel.findById(id, conn);

			if (!medicamento) {
				throw new Error('El medicamento no existe.');
			}

			return medicamento;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method readMedicamentoByNombre
	 * @description Método para leer un medicamento por su nombre.
	 * @static
	 * @async
	 * @memberof MedicamentoService
	 * @param {string} nombre - El nombre del medicamento.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El medicamento.
	 */
	static async readMedicamentoByNombre(nombre, conn = dbConn) {
		return await MedicamentoModel.findByNombre(nombre, conn);
	}

	/**
	 * @method createMedicamento
	 * @description Método para crear un nuevo medicamento.
	 * @static
	 * @async
	 * @memberof MedicamentoService
	 * @param {Object} data - El objeto del nuevo medicamento.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo medicamento creado.
	 */
	static async createMedicamento(data, conn = dbConn) {
		try {
			const medicamento = ObjectFactory.createMedicamentoObject(data);
			const medicamentoExistente = await MedicamentoModel.findByNombre(medicamento.nombre, conn);

			if (medicamentoExistente) {
				throw new Error('Ya existe un medicamento con ese nombre.');
			}

			return await MedicamentoModel.save(medicamento, conn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method updateMedicamento
	 * @description Método para actualizar un medicamento por su ID.
	 * @static
	 * @async
	 * @memberof MedicamentoService
	 * @param {number} id - El ID del medicamento.
	 * @param {Object} data - El objeto del medicamento con los datos actualizados.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El medicamento actualizado.
	 */
	static async updateMedicamento(id, data, conn = dbConn) {
		try {
			const medicamento = ObjectFactory.createMedicamentoObject(data);
			const medicamentoExistente = await MedicamentoModel.findByNombre(medicamento.nombre, conn);

			if (medicamentoExistente && medicamentoExistente.id !== id) {
				throw new Error('Ya existe un medicamento con ese nombre.');
			}

			return await MedicamentoModel.updateById(id, medicamento, conn);
		} catch (err) {
			throw err;
		}
	}
}

// Exportación del servicio
export default MedicamentoService;
