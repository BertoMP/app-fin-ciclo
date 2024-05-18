// Importación de las librerías necesarias
import pkg from 'moment-timezone';
const { tz } = pkg;

/**
 * @name getSearchValues
 * @description Obtiene los valores de búsqueda por fecha para las consultas
 *              de la base de datos.
 * @memberof Util-Functions
 * @function
 * @param {Object} req - Objeto de solicitud de la petición
 * @param {string} type - Tipo de búsqueda a realizar
 * @returns {Object} - Objeto con los valores de búsqueda por fecha
 */
export const getSearchValues = (req, type) => {
	const page 			= parseInt(req.query.page) 	|| 1;
	const limit 		= req.query.limit 					|| 10;
	const search 		= req.query.search 					|| '';

	switch (type) {
		case 'search':
			return {
				page: page,
				limit: limit,
				search: search,
			};
		case 'date':
			const fechaInicio = req.query.fechaInicio
				? tz(req.query.fechaInicio, 'Europe/Madrid').format('YYYY-MM-DD')
				: tz().startOf('year').format('YYYY-MM-DD');
			const fechaFin = req.query.fechaFin
				? tz(req.query.fechaFin, 'Europe/Madrid').format('YYYY-MM-DD')
				: tz().add(3, 'year').format('YYYY-MM-DD');
			return {
				page: page,
				limit: limit,
				fechaInicio: fechaInicio,
				fechaFin: fechaFin
			};
		case 'role':
			const role_id = req.query.role || 0;
			return {
				page: page,
				limit: limit,
				role: role_id,
				search: search,
			};
		case 'medicalDateList':
			const fechaInicioCita = req.query.fechaInicioCita
				? tz(req.query.fechaInicioCita, 'Europe/Madrid').format('YYYY-MM-DD')
				: tz().startOf('year').format('YYYY-MM-DD');
			const fechaFinCita = req.query.fechaFinCita
				? tz(req.query.fechaFinCita, 'Europe/Madrid').format('YYYY-MM-DD')
				: tz().add(3, 'year').format('YYYY-MM-DD');

			return {
				page: page,
				limit: limit,
				fechaInicioCita: fechaInicioCita,
				fechaFinCita: fechaFinCita
			};
		case 'medicalDate':
			const fecha = req.query.fechaCita;
			const especialistaId = req.query.especialistaId
			return {
				page: page,
				limit: limit,
				fechaCita: fecha,
				especialistaId: especialistaId
			}
	}
}
