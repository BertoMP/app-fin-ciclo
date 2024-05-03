// Importación del modelo del servicio
import PacienteModel from '../models/paciente.model.js';

// Importación de las utilidades necesarias
import { dbConn } from '../util/database/database.js';

// Importación de servicios auxiliares
import UsuarioService from "./usuario.service.js";
import TokenService from './token.service.js';
import TensionArterialService from './tensionArterial.service.js';
import InformeService from './informe.service.js';
import PacienteTomaMedicamentoService from './pacienteTomaMedicamento.service.js';
import GlucometriaService from './glucometria.service.js';
import InformePatologiaService from './informePatologia.service.js';
import CitaService from './cita.service.js';

/**
 * @class PacienteService
 * @description Clase que contiene los métodos para interactuar con el modelo de Paciente.
 */
class PacienteService {
	/**
	 * @method createPaciente
	 * @description Método para crear un nuevo paciente.
	 * @static
	 * @async
	 * @memberof PacienteService
	 * @param {Object} paciente - El objeto del nuevo paciente.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo paciente creado.
	 */
	static async createPaciente(paciente, conn = dbConn) {
		return await PacienteModel.create(paciente, conn);
	}

	/**
	 * @method readPacientes
	 * @description Método para leer todos los pacientes.
	 * @static
	 * @async
	 * @memberof PacienteService
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de pacientes.
	 */
	static async readPacientes(conn = dbConn) {
		return await PacienteModel.findAll(conn);
	}

	/**
	 * @method readPacienteByUserId
	 * @description Método para leer un paciente por su ID de usuario.
	 * @static
	 * @async
	 * @memberof PacienteService
	 * @param {number} usuario_id - El ID de usuario del paciente.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El paciente.
	 */
	static async readPacienteByUserId(usuario_id, conn = dbConn) {
		return await PacienteModel.findByUserId(usuario_id, conn);
	}

	/**
	 * @method updatePaciente
	 * @description Método para actualizar un paciente por su ID.
	 * @static
	 * @async
	 * @memberof PacienteService
	 * @param {Object} paciente - El objeto del paciente.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El paciente actualizado.
	 */
	static async updatePaciente(paciente, conn = dbConn) {
		return await PacienteModel.updatePaciente(paciente, conn);
	}

	/**
	 * @method deletePaciente
	 * @description Método para eliminar un usuario y todas sus asociaciones.
	 * @static
	 * @async
	 * @memberof PacienteService
	 * @param {number} id - El ID del usuario.
	 * @param {Object} [conn=null] - La conexión a la base de datos. Si no se proporciona, se creará una nueva.
	 * @returns {Promise<void>} No devuelve nada. Si la operación es exitosa, se habrá eliminado el usuario y todas sus asociaciones en la base de datos.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deletePaciente(id, conn = null) {
		const isConnProvided = !!conn;

		if (!isConnProvided) {
			conn = await dbConn.getConnection();
		}

		try {
			if (!isConnProvided) {
				await conn.beginTransaction();
			}

			await TokenService.deleteToken(id, conn);

			const idsTomas = await PacienteTomaMedicamentoService.readTomasByUserId(id, conn);

			for (const idToma of idsTomas) {
				await PacienteTomaMedicamentoService.deleteTomaFromPrescription(idToma, conn);
			}

			await TensionArterialService.deleteTensionArterialByUserId(id, conn);

			await GlucometriaService.deleteGlucometriaByUserId(id, conn);

			const idInformes = await CitaService.readInformesByUserId(id, conn);

			await CitaService.deleteCitasByUserId(id, conn);

			for (const idInforme of idInformes) {
				await InformePatologiaService.deletePatologiaByInformeId(idInforme, conn);
				await InformeService.deleteInforme(idInforme, conn);
			}

			await PacienteModel.deletePacienteByUserId(id, conn);

			await UsuarioService.deleteUsuario(id, conn);

			if (!isConnProvided) {
				await conn.commit();
			}
		} catch (err) {
			if (!isConnProvided) {
				await conn.rollback();
			}
			throw new Error(err);
		} finally {
			if (!isConnProvided) {
				conn.release();
			}
		}
	}

	/**
	 * @method deletePacienteByUserId
	 * @description Método para eliminar un paciente por su ID de usuario.
	 * @static
	 * @async
	 * @memberof PacienteService
	 * @param {number} usuario_id - El ID de usuario del paciente.
	 * @param {Object} conn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 */
	static async deletePacienteByUserId(usuario_id, conn = dbConn) {
		return await PacienteModel.deletePacienteByUserId(usuario_id, conn);
	}
}

// Exportación del servicio
export default PacienteService;
