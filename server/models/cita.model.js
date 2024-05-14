// Importación de librerías necesarias
import { format } from 'date-fns';

/**
 * @class CitaModel
 * Clase que contiene los métodos para interactuar con la tabla de citas.
 */
class CitaModel {
	/**
	 * @method fetchAll
	 * @description Método para obtener todas las citas de un paciente en un rango de fechas.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} userId - El ID del usuario.
	 * @param {Object} searchValues - Los valores de búsqueda. Contiene el ID del paciente, la fecha de inicio y fin del rango de fechas, y la página de resultados.
	 * @param {number} limit - El límite de resultados por página.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que contiene los datos del paciente, un array de citas, el total de citas, la página actual y el total de páginas.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAll(userId, searchValues, limit, dbConn) {
		const page = searchValues.page;
		const fechaInicio = searchValues.fechaInicio;
		const fechaFin = searchValues.fechaFin;
		const offset = (page - 1) * limit;

		const query =
			'SELECT ' +
			'   cita.id, ' +
			'   cita.fecha, ' +
			'   cita.hora, ' +
			'   cita.informe_id, ' +
			'   especialista_user.id AS especialista_id, ' +
			'   especialista_user.nombre AS especialista_nombre, ' +
			'   especialista_user.primer_apellido AS especialista_primer_apellido, ' +
			'   especialista_user.segundo_apellido AS especialista_segundo_apellido, ' +
			'   especialidad.id AS especialidad_id, ' +
			'   especialidad.nombre AS especialidad_nombre, ' +
			'   consulta.id AS consulta_id, ' +
			'   consulta.nombre AS consulta_nombre, ' +
			'   paciente_user.id AS paciente_id, ' +
			'   paciente_user.nombre AS paciente_nombre, ' +
			'   paciente_user.primer_apellido AS paciente_primer_apellido, ' +
			'   paciente_user.segundo_apellido AS paciente_segundo_apellido ' +
			'FROM ' +
			'   cita ' +
			'INNER JOIN ' +
			'   paciente ON cita.paciente_id = paciente.usuario_id ' +
			'INNER JOIN ' +
			'   especialista ON cita.especialista_id = especialista.usuario_id ' +
			'INNER JOIN ' +
			'   usuario AS especialista_user ON especialista.usuario_id = especialista_user.id ' +
			'INNER JOIN ' +
			'   usuario AS paciente_user ON paciente.usuario_id = paciente_user.id ' +
			'INNER JOIN ' +
			'   especialidad ON especialista.especialidad_id = especialidad.id ' +
			'INNER JOIN ' +
			'   consulta ON especialista.consulta_id = consulta.id ' +
			'WHERE ' +
			'   cita.paciente_id = ? ' +
			'   AND cita.fecha BETWEEN ? AND ? ' +
			'ORDER BY ' +
			'   cita.fecha DESC, ' +
			'   cita.hora DESC ' +
			'LIMIT ? OFFSET ?';

		try {
			const [rows] = await dbConn.execute(query, [
				userId,
				fechaInicio,
				fechaFin,
				`${limit}`,
				`${offset}`,
			]);
			const [count] = await dbConn.execute(
				'SELECT ' +
					'   COUNT(*) AS count ' +
					'FROM ' +
					'   cita ' +
					'WHERE ' +
					'   paciente_id = ? AND ' +
					'   fecha BETWEEN ? AND ?',
				[userId, fechaInicio, fechaFin],
			);
			const total = count[0].count;
			const actualPage = page;
			const totalPages = Math.ceil(total / limit);

			const formattedRows = rows.reduce(
				(acumulador, cita) => {
					const fecha = format(new Date(cita.fecha), 'dd-MM-yyyy');

					if (!acumulador.datos_paciente) {
						acumulador.datos_paciente = {
							id: cita.paciente_id,
							nombre: cita.paciente_nombre,
							primer_apellido: cita.paciente_primer_apellido,
							segundo_apellido: cita.paciente_segundo_apellido,
						};
					}

					acumulador.citas.push({
						datos_cita: {
							id: cita.id,
							fecha: fecha,
							hora: cita.hora,
							datos_especialista: {
								especialista_id: cita.especialista_id,
								nombre: cita.especialista_nombre,
								primer_apellido: cita.especialista_primer_apellido,
								segundo_apellido: cita.especialista_segundo_apellido,
								datos_especialidad: {
									especialidad_id: cita.especialidad_id,
									especialidad_nombre: cita.especialidad_nombre,
								},
							},
							datos_consulta: {
								consulta_id: cita.consulta_id,
								consulta_nombre: cita.consulta_nombre,
							},
							informe_id: cita.informe_id,
						},
					});

					return acumulador;
				},
				{ datos_paciente: null, citas: [] },
			);

			return { rows: [formattedRows], total, actualPage, totalPages };
		} catch (err) {
			throw new Error('No se pudieron obtener las citas.');
		}
	}

	/**
	 * @method fetchById
	 * @description Método para obtener una cita por su ID.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} id - El ID de la cita.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Un objeto que contiene los datos del paciente, los datos de la cita, los datos del especialista, los datos de la especialidad, los datos de la consulta y el ID del informe.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchById(id, dbConn) {
		const query =
			'SELECT ' +
			'   cita.id, ' +
			'   cita.fecha, ' +
			'   cita.hora, ' +
			'   cita.informe_id, ' +
			'   especialista_user.id AS especialista_id, ' +
			'   especialista_user.nombre AS especialista_nombre, ' +
			'   especialista_user.primer_apellido AS especialista_primer_apellido, ' +
			'   especialista_user.segundo_apellido AS especialista_segundo_apellido, ' +
			'   especialidad.id AS especialidad_id, ' +
			'   especialidad.nombre AS especialidad_nombre, ' +
			'   consulta.id AS consulta_id, ' +
			'   consulta.nombre AS consulta_nombre, ' +
			'   paciente_user.id AS paciente_id, ' +
			'   paciente_user.nombre AS paciente_nombre, ' +
			'   paciente_user.primer_apellido AS paciente_primer_apellido, ' +
			'   paciente_user.segundo_apellido AS paciente_segundo_apellido ' +
			'FROM ' +
			'   cita ' +
			'INNER JOIN ' +
			'   especialista ON cita.especialista_id = especialista.usuario_id ' +
			'INNER JOIN ' +
			'   usuario AS especialista_user ON especialista.usuario_id = especialista_user.id ' +
			'INNER JOIN ' +
			'   paciente ON cita.paciente_id = paciente.usuario_id ' +
			'INNER JOIN ' +
			'   usuario AS paciente_user ON paciente.usuario_id = paciente_user.id ' +
			'INNER JOIN ' +
			'   especialidad ON especialista.especialidad_id = especialidad.id ' +
			'INNER JOIN ' +
			'   consulta ON especialista.consulta_id = consulta.id ' +
			'WHERE ' +
			'   cita.id = ?';

		try {
			const [rows] = await dbConn.execute(query, [id]);
			const cita = rows[0];

			if (!cita) {
				return null;
			}

			return {
				datos_paciente: {
					paciente_id: cita.paciente_id,
					nombre: cita.paciente_nombre,
					primer_apellido: cita.paciente_primer_apellido,
					segundo_apellido: cita.paciente_segundo_apellido,
				},
				datos_cita: {
					id: cita.id,
					fecha: format(new Date(cita.fecha), 'dd-MM-yyyy'),
					hora: cita.hora
				},
				datos_especialista: {
					especialista_id: cita.especialista_id,
					nombre: cita.especialista_nombre,
					primer_apellido: cita.especialista_primer_apellido,
					segundo_apellido: cita.especialista_segundo_apellido,
					datos_especialidad: {
						especialidad_id: cita.especialidad_id,
						especialidad_nombre: cita.especialidad_nombre,
					},
					datos_consulta: {
						consulta_id: cita.consulta_id,
						consulta_nombre: cita.consulta_nombre,
					},
				},
				informe_id: cita.informe_id,
			};
		} catch (err) {
			throw new Error('Error al obtener la cita.');
		}
	}

	/**
	 * @method fetchByPacienteId
	 * @description Método para obtener las citas de un especialista por su ID.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} especialista_id - El ID del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de citas del especialista.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchByEspecialistaId(especialista_id, dbConn) {
		const query =
			'SELECT * ' +
			'FROM ' +
			'   cita ' +
			'WHERE ' +
			'   especialista_id = ? ';

		try {
			const [rows] = await dbConn.execute(query, [especialista_id]);
			return rows;
		} catch (err) {
			throw new Error('Error al obtener las citas.');
		}
	}

	/**
	 * @method fetchByData
	 * @description Método para obtener una cita por su fecha, hora y ID del especialista.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {Object} data - Los datos de búsqueda. Contiene la fecha, la hora y el ID del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} La cita que coincide con los datos de búsqueda.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchByData(data, dbConn) {
		const query =
			'SELECT * ' +
			'FROM ' +
			'   cita ' +
			'WHERE ' +
			'   fecha = ? ' +
			'   AND hora = ? ' +
			'   AND especialista_id = ? ';

		try {
			const [rows] = await dbConn.execute(query, [data.fecha, data.hora, data.especialista_id]);
			return rows[0];
		} catch (err) {
			throw new Error('Error al obtener la cita.');
		}
	}

	/**
	 * @method fetchAgenda
	 * @description Método para obtener la agenda de un especialista.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} especialista_id - El ID del especialista.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de citas del especialista para el día actual.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchAgenda(especialista_id, dbConn) {
		const query =
			'SELECT ' +
			'   cita.id, ' +
			'   cita.hora, ' +
			'   cita.informe_id, ' +
			'   paciente.usuario_id AS paciente_id, ' +
			'   paciente.num_historia_clinica AS paciente_historia_clinica, ' +
			'   usuario.nombre AS paciente_nombre, ' +
			'   usuario.primer_apellido AS paciente_primer_apellido, ' +
			'   usuario.segundo_apellido AS paciente_segundo_apellido ' +
			'FROM ' +
			'   cita ' +
			'INNER JOIN ' +
			'   paciente ON cita.paciente_id = paciente.usuario_id ' +
			'INNER JOIN ' +
			'   usuario ON paciente.usuario_id = usuario.id ' +
			'WHERE ' +
			'   especialista_id = ? ' +
			'   AND fecha = CURDATE() ';

		try {
			const [rows] = await dbConn.execute(query, [especialista_id]);

			if (rows.length === 0) {
				return null;
			}

			return rows;
		} catch (err) {
			throw new Error('Error al obtener la agenda.');
		}
	}

	/**
	 * @method createCita
	 * @description Método para crear una nueva cita.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {Object} cita - El objeto de la nueva cita.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<{datos_cita: {fecha: string, hora: *, paciente_id: *, especialista_id: *}, id: number}>} El ID de la nueva cita creada.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async createCita(cita, dbConn) {
		const fecha = cita.fecha;
		const hora = cita.hora;
		const paciente_id = cita.paciente_id;
		const especialista_id = cita.especialista_id;

		const query =
			'INSERT INTO cita (fecha, hora, paciente_id, especialista_id) ' +
			'		VALUES (?, ?, ?, ?)';

		try {
			const [rows] = await dbConn.execute(query, [fecha, hora, paciente_id, especialista_id]);

			return {
				id: rows.insertId,
				datos_cita: {
					paciente_id: paciente_id,
					especialista_id: especialista_id,
					fecha: format(new Date(fecha), 'dd-MM-yyyy'),
					hora: hora,
				}
			};
		} catch (err) {
			throw new Error('Error al crear la cita.');
		}
	}

	/**
	 * @method deleteCita
	 * @description Método para eliminar una cita por su ID.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} id - El ID de la cita.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<void>} No retorna nada si la operación es exitosa.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteCita(id, dbConn) {
		const query =
			'DELETE ' +
			'FROM ' +
			'		cita ' +
			'WHERE id = ?';

		try {
			return await dbConn.execute(query, [id]);
		} catch (err) {
			throw new Error('Error al eliminar la cita.');
		}
	}

	/**
	 * @method getInformesByUserId
	 * @description Método para obtener los IDs de los informes de un paciente por su ID de usuario.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} paciente_id - El ID de usuario del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de IDs de los informes del paciente.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async getInformesByUserId(paciente_id, dbConn) {
		const query =
			'SELECT ' +
			'		informe_id ' +
			'FROM ' +
			'		cita ' +
			'WHERE ' +
			'		paciente_id = ?';

		try {
			const [rows] = await dbConn.execute(query, [paciente_id]);
			return rows.map((row) => row.informe_id);
		} catch (err) {
			throw new Error('Error al obtener los informes.');
		}
	}

	/**
	 * @method deleteCitasByUserId
	 * @description Método para eliminar todas las citas de un paciente por su ID de usuario.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} paciente_id - El ID de usuario del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Devuelve un objeto con la información de la operación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deleteCitasByUserId(paciente_id, dbConn) {
		const query =
			'DELETE ' +
			'FROM ' +
			'		cita ' +
			'WHERE ' +
			'		paciente_id = ?';

		try {
			return await dbConn.execute(query, [paciente_id]);
		} catch (err) {
			throw new Error('Error al eliminar las citas.');
		}
	}

	/**
	 * @method fetchPacienteIdByInformeId
	 * @description Método para obtener el ID de un paciente por el ID de su informe.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} informe_id - El ID del informe.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<{paciente_id: *}>} El ID del paciente o null si no se encuentra.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async fetchPacienteIdByInformeId(informe_id, dbConn) {
		const query =
			'SELECT ' +
			'		paciente_id ' +
			'FROM ' +
			'		cita ' +
			'WHERE ' +
			'		informe_id = ?';

		try {
			const [rows] = await dbConn.execute(query, [informe_id]);

			if (rows.length === 0) {
				return null;
			}

			return {
				paciente_id: rows[0].paciente_id
			}
		} catch (err) {
			throw new Error('Error al obtener el ID del paciente.');
		}
	}

	/**
	 * @method updateInformeId
	 * @description Método para actualizar el ID del informe de una cita.
	 * @static
	 * @async
	 * @memberof CitaModel
	 * @param {number} cita_id - El ID de la cita.
	 * @param {number} informe_id - El nuevo ID del informe.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} Devuelve un objeto con la información de la operación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updateInformeId(cita_id, informe_id, dbConn) {
		const query =
			'UPDATE ' +
			'		cita ' +
			'SET ' +
			'		informe_id = ? ' +
			'WHERE ' +
			'		id = ?';

		try {
			return await dbConn.execute(query, [informe_id, cita_id]);
		} catch (err) {
			throw new Error('Error al actualizar el ID del informe.');
		}
	}
}

// Exportación del modelo
export default CitaModel;
