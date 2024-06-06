// Importación de las librerías necesarias.
import { format } from 'date-fns';

/**
 * @class InformeModel
 * @description Clase que contiene los métodos para interactuar con la tabla de informes.
 */
class InformeModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todos los informes de un usuario.
	 * @static
	 * @async
	 * @memberof InformeModel
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} searchValues - Los valores de búsqueda.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que representa los informes.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(userId, searchValues, dbConn) {
		const page = searchValues.page;
		const fechaInicio = searchValues.fechaInicio;
		const fechaFin = searchValues.fechaFin;
		const limit = searchValues.limit;
		const offset = (page - 1) * limit;

		const query =
			'SELECT' +
			' informe.id AS informe_id,' +
			' cita.fecha,' +
			' especialidad.nombre AS especialidad_nombre ' +
			'FROM' +
			' informe ' +
			'INNER JOIN' +
			' cita ON informe.id = cita.informe_id ' +
			'INNER JOIN' +
			' especialista ON cita.especialista_id = especialista.usuario_id ' +
			'INNER JOIN' +
			' especialidad ON especialista.especialidad_id = especialidad.id ' +
			'WHERE' +
			' cita.paciente_id = ? ' +
			' AND cita.fecha BETWEEN ? AND ? ' +
			'ORDER BY' +
			' cita.fecha DESC, ' +
			' cita.hora DESC ' +
			'LIMIT ? OFFSET ?';

		const countQuery =
			'SELECT' +
			' COUNT(*) AS total ' +
			'FROM ' +
			' informe ' +
			'INNER JOIN ' +
			' cita ON informe.id = cita.informe_id ' +
			'INNER JOIN ' +
			' especialista ON cita.especialista_id = especialista.usuario_id ' +
			'INNER JOIN ' +
			' especialidad ON especialista.especialidad_id = especialidad.id ' +
			'WHERE ' +
			' cita.paciente_id = ? ' +
			' AND cita.fecha BETWEEN ? AND ?';

		try {
			const [rows] = await dbConn.execute(query, [userId, fechaInicio, fechaFin, `${limit}`, `${offset}`]);
			const [total] = await dbConn.execute(countQuery, [userId, fechaInicio, fechaFin]);
			const totalInformes = total[0].total;
			const totalPages = Math.ceil(totalInformes / limit);
			const actualPage = page;

			rows.forEach((informe) => {
				informe.fecha = format(new Date(informe.fecha), 'dd-MM-yyyy');
			});

			return {
				rows,
				total: totalInformes,
				totalPages,
				actualPage,
			};
		} catch (err) {
			throw new Error('Error al obtener los informes.');
		}
	}

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
			' informe.id AS informe_id,' +
			' informe.motivo,' +
			' informe.contenido,' +
			' cita.id AS cita_id,' +
			' cita.fecha,' +
			' cita.hora,' +
			' paciente.usuario_id AS paciente_id,' +
			' paciente.num_historia_clinica,' +
			' tipo_via.nombre AS nombre_tipo_via,' +
			' paciente.nombre_via AS paciente_nombre_via,' +
			' paciente.numero AS paciente_numero,' +
			' paciente.piso AS paciente_piso,' +
			' paciente.puerta AS paciente_puerta,' +
			' municipio.nombre AS paciente_municipio,' +
			' provincia.nombre AS paciente_provincia,' +
			' paciente.codigo_postal AS paciente_codigo_postal,' +
			' paciente.tel_fijo AS paciente_tel_fijo,' +
			' paciente.tel_movil AS paciente_tel_movil,' +
			' usuario_paciente.email AS paciente_email,' +
			' usuario_paciente.nombre AS paciente_nombre,' +
			' usuario_paciente.primer_apellido AS paciente_primer_apellido,' +
			' usuario_paciente.segundo_apellido AS paciente_segundo_apellido,' +
			' usuario_paciente.dni AS paciente_dni,' +
			' especialista.usuario_id AS especialista_id,' +
			' especialista.num_colegiado,' +
			' especialidad.nombre AS especialidad_nombre,' +
			' consulta.id AS consulta_id,' +
			' consulta.nombre AS consulta_nombre,' +
			' usuario_especialista.email AS especialista_email, ' +
			' usuario_especialista.nombre AS especialista_nombre, ' +
			' usuario_especialista.primer_apellido AS especialista_primer_apellido, ' +
			' usuario_especialista.segundo_apellido AS especialista_segundo_apellido, ' +
			' patologia.id AS patologia_id,' +
			' patologia.nombre AS patologia_nombre,' +
			' patologia.descripcion AS patologia_descripcion ' +
			'FROM' +
			' informe ' +
			'INNER JOIN ' +
			' cita ON informe.id = cita.informe_id ' +
			'INNER JOIN ' +
			' paciente ON cita.paciente_id = paciente.usuario_id ' +
			'INNER JOIN ' +
			' tipo_via ON paciente.tipo_via = tipo_via.id ' +
			'INNER JOIN ' +
			' municipio ON paciente.municipio = municipio.id ' +
			'INNER JOIN ' +
			' provincia ON municipio.provincia_id = provincia.id ' +
			'INNER JOIN ' +
			' usuario AS usuario_paciente ON paciente.usuario_id = usuario_paciente.id ' +
			'INNER JOIN ' +
			' especialista ON cita.especialista_id = especialista.usuario_id ' +
			'INNER JOIN ' +
			' usuario AS usuario_especialista ON especialista.usuario_id = usuario_especialista.id ' +
			'INNER JOIN ' +
			' consulta ON especialista.consulta_id = consulta.id ' +
			'INNER JOIN ' +
			' especialidad ON especialista.especialidad_id = especialidad.id ' +
			'INNER JOIN ' +
			' informe_patologia ON informe.id = informe_patologia.informe_id ' +
			'INNER JOIN ' +
			' patologia ON informe_patologia.patologia_id = patologia.id ' +
			'WHERE' +
			' informe.id = ?';
		try {
			const [rows] = await dbConn.execute(query, [id]);

			if (rows.length === 0) {
				return null;
			}

			return {
				datos_cita: {
					id: rows[0].cita_id,
					fecha: format(new Date(rows[0].fecha), 'dd-MM-yyyy'),
					hora: rows[0].hora,
				},
				datos_paciente: {
					usuario_id: rows[0].paciente_id,
					num_historia_clinica: rows[0].num_historia_clinica,
					datos_personales: {
						email: rows[0].paciente_email,
						nombre: rows[0].paciente_nombre,
						primer_apellido: rows[0].paciente_primer_apellido,
						segundo_apellido: rows[0].paciente_segundo_apellido,
						dni: rows[0].paciente_dni,
					},
					datos_vivienda: {
						tipo_via: rows[0].nombre_tipo_via,
						nombre_via: rows[0].paciente_nombre_via,
						numero: rows[0].paciente_numero,
						piso: rows[0].paciente_piso,
						puerta: rows[0].paciente_puerta,
						municipio: rows[0].paciente_municipio,
						codigo_postal: rows[0].paciente_codigo_postal,
						provincia: rows[0].paciente_provincia,
					},
					telefonos: {
						tel_fijo: rows[0].paciente_tel_fijo,
						tel_movil: rows[0].paciente_tel_movil,
					},
				},
				datos_especialista: {
					usuario_id: rows[0].especialista_id,
					num_colegiado: rows[0].num_colegiado,
					datos_personales: {
						email: rows[0].especialista_email,
						nombre: rows[0].especialista_nombre,
						primer_apellido: rows[0].especialista_primer_apellido,
						segundo_apellido: rows[0].especialista_segundo_apellido,
					},
					especialidad: rows[0].especialidad_nombre,
					datos_consulta: {
						id: rows[0].consulta_id,
						nombre: rows[0].consulta_nombre,
					}
				},
				datos_informe: {
					id: rows[0].informe_id,
					motivo: rows[0].motivo,
					contenido: rows[0].contenido,
					patologias: rows.map((patologia) => {
						return {
							id: patologia.patologia_id,
							nombre: patologia.patologia_nombre,
							descripcion: patologia.patologia_descripcion,
						};
					}),
				},
			};
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

		const query =
			'INSERT INTO informe (motivo, contenido) ' +
			' VALUES (?, ?)';

		try {
			const informe = await dbConn.execute(query, [motivo, contenido]);

			return {
				id: informe[0].insertId,
				datos_informe: {
					motivo: motivo,
					contenido: contenido,
				},
			};
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
		const query =
			'DELETE ' +
			'FROM ' +
			' informe ' +
			'WHERE ' +
			' id = ?';

		try {
			return await dbConn.execute(query, [informeId]);
		} catch (err) {
			throw new Error('Error al eliminar el informe.');
		}
	}
}

// Exportación del modelo.
export default InformeModel;
