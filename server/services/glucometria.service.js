// Importación del modelo del servicio
import GlucometriaModel from '../models/glucometria.model.js';

// Importación de utilidades necesarias
import { dbConn } from '../util/database/database.js';
import ObjectFactory from "../util/classes/objectFactory.js";
import PacienteService from "./paciente.service.js";

/**
 * @class GlucometriaService
 * @description Clase que contiene los métodos para interactuar con el modelo de Glucometria.
 */
class GlucometriaService {
	/**
	 * @method readGlucometria
	 * @description Método para leer las glucometrias basado en los valores de búsqueda y un límite.
	 * @static
	 * @async
	 * @memberof GlucometriaService
	 * @param {Object} searchValues - Los valores de búsqueda para las glucometrias.
	 * @param {number} paciente_id - El ID del paciente.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un array de glucometrias.
	 */
	static async readGlucometria(searchValues, paciente_id, conn = dbConn) {
		try {
			const paciente = await PacienteService.readPacienteByUserId(paciente_id);

			if (!paciente) {
				throw new Error('El paciente no existe.');
			}

			const page = searchValues.page;
			const fechaInicio = searchValues.fechaInicio;
			const fechaFin = searchValues.fechaFin;
			const limit = searchValues.limit;

			const {
				formattedRows: resultados,
				total: cantidad_glucometrias,
				actualPage: pagina_actual,
				totalPages: paginas_totales,
			} = await GlucometriaModel.fetchAll(searchValues, paciente_id, conn);

			if (page > 1 && page > paginas_totales) {
				throw new Error('La página solicitada no existe.');
			}

			let query = '';

			if (fechaInicio) {
				query += `&fechaInicio=${fechaInicio}`;
			}

			if (fechaFin) {
				query += `&fechaFin=${fechaFin}`;
			}

			const prev =
				page > 1
					? `/glucometria/${paciente_id}?page=${page - 1}&limit=${limit}${query}`
					: null;
			const next =
				page < paginas_totales
					? `/glucometria/${paciente_id}?page=${page + 1}&limit=${limit}${query}`
					: null;
			const result_min = (page - 1) * limit + 1;
			const result_max =
				resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
			const fecha_inicio = fechaInicio;
			const fecha_fin = fechaFin;
			const items_pagina = parseInt(limit);

			return {
				prev,
				next,
				pagina_actual,
				paginas_totales,
				cantidad_glucometrias,
				result_min,
				result_max,
				items_pagina,
				fecha_inicio,
				fecha_fin,
				resultados,
			};
		} catch (error) {
			throw error;
		}

		return await GlucometriaModel.fetchAll(searchValues, paciente_id, conn);
	}

	/**
	 * @method createGlucometria
	 * @description Método para crear una nueva glucometria.
	 * @static
	 * @async
	 * @memberof GlucometriaService
	 * @param {number} paciente - El ID del paciente.
	 * @param {Object} data - El objeto de la nueva glucometria.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La nueva glucometria creada.
	 */
	static async createGlucometria(paciente, data, conn = dbConn) {
		try {
			const glucometria = ObjectFactory.createGlucometriaObject(data);

			return await GlucometriaModel.create(paciente, glucometria, conn);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * @method deleteGlucometriaByUserId
	 * @description Método para eliminar las glucometrias de un usuario por su ID.
	 * @static
	 * @async
	 * @memberof GlucometriaService
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deleteGlucometriaByUserId(userId, conn = dbConn) {
		return await GlucometriaModel.deleteGlucometriasByUserId(userId, conn);
	}
}

// Exportación del servicio
export default GlucometriaService;
