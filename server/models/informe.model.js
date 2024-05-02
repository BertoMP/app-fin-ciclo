// Importación de las librerías necesarias.
import { format } from 'date-fns';

/**
 * @class InformeModel
 * @description Clase que contiene los métodos para interactuar con la tabla de informes.
 */
class InformeModel {
	/**
	 * @method fetchById
	 * @description Método para obtener un informe por su ID.
	 * @static
	 * @async
	 * @memberof InformeModel
	 * @param {number} id - El ID del informe.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El informe.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchById(id, dbConn) {
		const query =
			'SELECT' +
			'    informe.id AS informe_id,' +
			'    informe.motivo,' +
			'    informe.contenido,' +
			'    cita.id AS cita_id,' +
			'    cita.fecha,' +
			'    cita.hora,' +
			'    paciente.usuario_id AS paciente_id,' +
			'    paciente.num_historia_clinica,' +
			'    usuario_paciente.nombre AS paciente_nombre,' +
			'    usuario_paciente.primer_apellido AS paciente_primer_apellido, ' +
			'    usuario_paciente.segundo_apellido AS paciente_segundo_apellido,' +
			'    especialista.usuario_id AS especialista_id,' +
			'    especialista.num_colegiado,' +
			'    especialidad.nombre AS especialidad_nombre,' +
			'    usuario_especialista.nombre AS especialista_nombre, ' +
			'    usuario_especialista.primer_apellido AS especialista_primer_apellido, ' +
			'    usuario_especialista.segundo_apellido AS especialista_segundo_apellido, ' +
			'    patologia.id AS patologia_id,' +
			'    patologia.nombre AS patologia_nombre,' +
			'    patologia.descripcion AS patologia_descripcion ' +
			'FROM' +
			'    informe ' +
			'INNER JOIN ' +
			'    cita ON informe.id = cita.informe_id ' +
			'INNER JOIN ' +
			'    paciente ON cita.paciente_id = paciente.usuario_id ' +
			'INNER JOIN ' +
			'    usuario AS usuario_paciente ON paciente.usuario_id = usuario_paciente.id ' +
			'INNER JOIN ' +
			'    especialista ON cita.especialista_id = especialista.usuario_id ' +
			'INNER JOIN ' +
			'    usuario AS usuario_especialista ON especialista.usuario_id = usuario_especialista.id ' +
			'INNER JOIN ' +
			'    especialidad ON especialista.especialidad_id = especialidad.id ' +
			'INNER JOIN ' +
			'    informe_patologia ON informe.id = informe_patologia.informe_id ' +
			'INNER JOIN ' +
			'    patologia ON informe_patologia.patologia_id = patologia.id ' +
			'WHERE' +
			'    informe.id = ?';
		try {
			const [rows] = await dbConn.execute(query, [id]);
			const informe = rows[0];

			if (informe) {
				const fecha = format(new Date(informe.fecha), 'dd-MM-yyyy');

				return {
					datos_cita: {
						id: informe.cita_id,
						fecha: fecha,
						hora: informe.hora,
					},
					datos_paciente: {
						usuario_id: informe.paciente_id,
						num_historia_clinica: informe.num_historia_clinica,
						nombre: informe.paciente_nombre,
						primer_apellido: informe.paciente_primer_apellido,
						segundo_apellido: informe.paciente_segundo_apellido,
					},
					datos_especialista: {
						usuario_id: informe.especialista_id,
						num_colegiado: informe.num_colegiado,
						especialidad: informe.especialidad_nombre,
						nombre: informe.especialista_nombre,
						primer_apellido: informe.especialista_primer_apellido,
						segundo_apellido: informe.especialista_segundo_apellido,
					},
					datos_informe: {
						id: informe.informe_id,
						motivo: informe.motivo,
						contenido: informe.contenido,
						patologias: rows.map((patologia) => {
							return {
								id: patologia.patologia_id,
								nombre: patologia.patologia_nombre,
								descripcion: patologia.patologia_descripcion,
							};
						}),
					},
				};
			}

			return informe;
		} catch (err) {
			throw new Error('Error al obtener el informe.');
		}
	}

	/**
	 * @method create
	 * @description Método para crear un nuevo informe.
	 * @static
	 * @async
	 * @memberof InformeModel
	 * @param {Object} informe - El objeto del nuevo informe.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo informe creado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async create(informe, dbConn) {
		const motivo = informe.motivo;
		const contenido = informe.contenido;

		const query = 'INSERT INTO informe (motivo, contenido) VALUES (?, ?)';

		try {
			const informe = await dbConn.execute(query, [motivo, contenido]);

			return informe[0];
		} catch (err) {
			throw new Error('Error al crear el informe.');
		}
	}

	/**
	 * @method deleteInforme
	 * @description Método para eliminar un informe por su ID.
	 * @static
	 * @async
	 * @memberof InformeModel
	 * @param {number} informeId - El ID del informe.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteInforme(informeId, dbConn) {
		const query = 'DELETE FROM informe WHERE id = ?';

		try {
			return await dbConn.execute(query, [informeId]);
		} catch (err) {
			throw new Error('Error al eliminar el informe.');
		}
	}
}

// Exportación del modelo.
export default InformeModel;
