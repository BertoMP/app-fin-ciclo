/**
 * @name getSearchValuesByRole
 * @description Obtiene los valores de búsqueda para la consulta de usuarios
 * @function
 * @memberof Util-Functions
 * @param {Object} req - Objeto de solicitud de la petición
 * @returns {Object} - Objeto con los valores de búsqueda
 */
export const getSearchValuesByRole = (req) => {
	const page = parseInt(req.query.page) || 1;
	const role_id = req.query.role || 0;

	return {
		page: page,
		role: role_id,
	};
};
