// Importación de librerías necesarias
import pkg from 'moment-timezone';
const { tz } = pkg;

/**
 * @class PacienteModel
 * @description Clase que contiene los métodos para interactuar con la tabla de pacientes.
 */
class PacienteModel {
	/**
	 * @method findAll
	 * @description Método para obtener todos los pacientes.
	 * @static
	 * @async
	 * @memberof PacienteModel
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Array>} Un array de pacientes.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findAll(dbConn) {
		const query =
			'SELECT ' +
			'   paciente.usuario_id AS paciente_id,' +
			'   usuario.nombre AS nombre,' +
			'   usuario.primer_apellido AS primer_apellido,' +
			'   usuario.segundo_apellido AS segundo_apellido,' +
			'   paciente.num_historia_clinica ' +
			'FROM ' +
			'   paciente ' +
			'INNER JOIN ' +
			'   usuario ON paciente.usuario_id = usuario.id';

		try {
			const [rows] = await dbConn.execute(query);

			return rows;
		} catch (err) {
			throw new Error('Error al obtener los pacientes.');
		}
	}

	/**
	 * @method create
	 * @description Método para crear un nuevo paciente.
	 * @static
	 * @async
	 * @memberof PacienteModel
	 * @param {Object} paciente - El objeto del nuevo paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El nuevo paciente creado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async create(paciente, dbConn) {
		const usuario_id = paciente.usuario_id;
		const num_hist_clinica = paciente.num_hist_clinica;
		const fecha_nacimiento = paciente.fecha_nacimiento;
		const tipo_via = paciente.tipo_via;
		const nombre_via = paciente.nombre_via;
		const numero = paciente.numero;
		const piso = paciente.piso;
		const puerta = paciente.puerta;
		const municipio = paciente.municipio;
		const codigo_postal = paciente.codigo_postal;
		const tel_fijo = paciente.tel_fijo;
		const tel_movil = paciente.tel_movil;

		const query =
			'INSERT INTO paciente ' +
			'(usuario_id, num_historia_clinica, fecha_nacimiento, tipo_via,' +
			' nombre_via, numero, piso, puerta, municipio,' +
			' codigo_postal, tel_fijo, tel_movil) ' +
			'   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

		try {
			return await dbConn.execute(query, [
				usuario_id,
				num_hist_clinica,
				fecha_nacimiento,
				tipo_via,
				nombre_via,
				numero,
				piso,
				puerta,
				municipio,
				codigo_postal,
				tel_fijo,
				tel_movil,
			]);
		} catch (err) {
			throw new Error('Error al crear el paciente.');
		}
	}

	/**
	 * @method findByUserId
	 * @description Método para obtener un paciente por su ID de usuario.
	 * @static
	 * @async
	 * @memberof PacienteModel
	 * @param {number} usuario_id - El ID de usuario del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El paciente.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async findByUserId(usuario_id, dbConn) {
		const query =
			'SELECT ' +
			'   usuario.id, ' +
			'   email, ' +
			'   usuario.nombre AS usuario_nombre, ' +
			'   primer_apellido, ' +
			'   segundo_apellido, ' +
			'   dni, ' +
			'   rol_id, ' +
			'   rol.nombre AS nombre_rol, ' +
			'   num_historia_clinica, ' +
			'   fecha_nacimiento, ' +
			'   tipo_via, ' +
			'   tipo_via.nombre AS tipo_via_nombre, ' +
			'   nombre_via, ' +
			'   numero, ' +
			'   piso, ' +
			'   puerta, ' +
			'   municipio AS municipio_id, ' +
			'   municipio.nombre AS municipio_nombre,' +
			'   provincia_id, ' +
			'   provincia.nombre AS provincia_nombre, ' +
			'   codigo_postal, ' +
			'   tel_fijo, ' +
			'   tel_movil ' +
			'FROM ' +
			'   paciente ' +
			'INNER JOIN ' +
			'   usuario ON paciente.usuario_id = usuario.id ' +
			'INNER JOIN ' +
			'   tipo_via ON paciente.tipo_via = tipo_via.id ' +
			'INNER JOIN ' +
			'   municipio ON paciente.municipio = municipio.id ' +
			'INNER JOIN ' +
			'   provincia ON municipio.provincia_id = provincia.id ' +
			'INNER JOIN ' +
			'   rol ON usuario.rol_id = rol.id ' +
			'WHERE ' +
			'   usuario_id = ?';

		try {
			const [rows] = await dbConn.execute(query, [usuario_id]);

			if (rows.length === 0) {
				return null;
			}

			return {
				usuario_id: rows[0].id,
				datos_personales: {
					email: rows[0].email,
					nombre: rows[0].usuario_nombre,
					primer_apellido: rows[0].primer_apellido,
					segundo_apellido: rows[0].segundo_apellido,
					dni: rows[0].dni,
				},
				datos_rol: {
					id: rows[0].rol_id,
					nombre: rows[0].nombre_rol,
				},
				datos_paciente: {
					num_historia_clinica: rows[0].num_historia_clinica,
					fecha_nacimiento: tz(rows[0].fecha_nacimiento, 'Europe/Madrid').format('DD-MM-YYYY'),
					datos_vivienda: {
						tipo_via: {
							id: rows[0].tipo_via,
							nombre: rows[0].tipo_via_nombre,
						},
						nombre_via: rows[0].nombre_via,
						numero: rows[0].numero,
						piso: rows[0].piso,
						puerta: rows[0].puerta,
						municipio: {
							id: rows[0].municipio_id,
							nombre: rows[0].municipio_nombre,
							codigo_postal: rows[0].codigo_postal
						},
						provincia: {
							id: rows[0].provincia_id,
							nombre: rows[0].provincia_nombre,
						}
					},
					datos_contacto: {
						tel_fijo: rows[0].tel_fijo,
						tel_movil: rows[0].tel_movil,
					},
				}
			};
		} catch (err) {
			throw new Error('Error al obtener el paciente.');
		}
	}

	/**
	 * @method deletePacienteByUserId
	 * @description Método para eliminar un paciente por su ID de usuario.
	 * @static
	 * @async
	 * @memberof PacienteModel
	 * @param {number} usuario_id - El ID de usuario del paciente.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El resultado de la operación de eliminación.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async deletePacienteByUserId(usuario_id, dbConn) {
		const query = 'DELETE FROM paciente WHERE usuario_id = ?';

		try {
			return await dbConn.execute(query, [usuario_id]);
		} catch (err) {
			throw new Error('Error al eliminar el paciente.');
		}
	}

	/**
	 * @method update
	 * @description Método para actualizar un paciente.
	 * @static
	 * @async
	 * @memberof PacienteModel
	 * @param {Object} paciente - El objeto del paciente con los datos actualizados.
	 * @param {Object} dbConn - La conexión a la base de datos.
	 * @returns {Promise<Object>} El paciente actualizado.
	 * @throws {Error} Si ocurre un error durante la operación, se lanzará un error.
	 */
	static async updatePaciente(paciente, dbConn) {
		const fecha_nacimiento = paciente.fecha_nacimiento;
		const tipo_via = paciente.tipo_via;
		const nombre_via = paciente.nombre_via;
		const numero = paciente.numero;
		const piso = paciente.piso;
		const puerta = paciente.puerta;
		const municipio = paciente.municipio;
		const codigo_postal = paciente.codigo_postal;
		const tel_fijo = paciente.tel_fijo;
		const tel_movil = paciente.tel_movil;
		const usuario_id = paciente.usuario_id;

		const query =
			'UPDATE ' +
			'   paciente ' +
			'SET ' +
			'   fecha_nacimiento = ?, ' +
			'   tipo_via = ?, ' +
			'   nombre_via = ?, ' +
			'   numero = ?, ' +
			'   piso = ?, ' +
			'   puerta = ?, ' +
			'   municipio = ?, ' +
			'   codigo_postal = ?, ' +
			'   tel_fijo = ?, ' +
			'   tel_movil = ? ' +
			'WHERE ' +
			'   usuario_id = ?';

		try {
			return await dbConn.execute(query, [
				fecha_nacimiento,
				tipo_via,
				nombre_via,
				numero,
				piso,
				puerta,
				municipio,
				codigo_postal,
				tel_fijo,
				tel_movil,
				usuario_id,
			]);
		} catch (err) {
			throw new Error('Error al actualizar el paciente.');
		}
	}
}

// Exportación del modelo
export default PacienteModel;
