// Importación de las librerías necesarias
import pkg from 'moment-timezone';
const { tz } = pkg;

/**
 * @name getSearchValuesByDate
 * @description Obtiene los valores de búsqueda por fecha para las consultas
 *              de la base de datos.
 * @memberof Util-Functions
 * @function
 * @param {Object} req - Objeto de solicitud de la petición
 * @param {boolean} possibleFutureDates - Indica si se permiten fechas futuras
 * @returns {Object} - Objeto con los valores de búsqueda por fecha
 */
export const getSearchValuesByDate = (req, possibleFutureDates = false) => {
	const page = parseInt(req.query.page) || 1;

	const fechaInicio = req.query.fechaInicio
		? tz(req.query.fechaInicio, 'Europe/Madrid').format('YYYY-MM-DD')
		: tz().startOf('year').format('YYYY-MM-DD');
	const fechaFin = req.query.fechaFin
		? tz(req.query.fechaFin, 'Europe/Madrid').format('YYYY-MM-DD')
		: possibleFutureDates
		? tz().add(3, 'year').format('YYYY-MM-DD')
		: tz().format('YYYY-MM-DD');

	let paciente_id = 0;

	if (req.user_role === 2) {
		paciente_id = req.user_id;
	} else if (req.user_role === 3) {
		paciente_id = req.params.usuario_id;
	}

	return {
		fechaInicio: fechaInicio,
		fechaFin: fechaFin,
		page: page,
		paciente_id: paciente_id,
	};
};
