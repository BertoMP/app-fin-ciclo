/**
 * @name verifyUserRole
 * @description Middleware que verifica si el rol del usuario está presente en
 *              el objeto de solicitud (req) y si está incluido en los roles
 *              permitidos.
 *              Si el rol del usuario no está presente o no está permitido,
 *              se envía una respuesta con el estado 403 y un mensaje de error.
 *              Si el rol del usuario está presente y permitido, se llama a la
 *              función next() para pasar al siguiente middleware o ruta.
 * @param {Array} roles - Arreglo con los roles de usuario permitidos para acceder.
 * @memberof Util-Middleware
 * @function
 */
export const verifyUserRole = (roles) => {
	return (req, res, next) => {
		if (!req.user_role || !roles.includes(req.user_role)) {
			return res.status(403).json({
				errors: ['No tienes permiso para realizar esta acción.'],
			});
		}
		next();
	};
};
