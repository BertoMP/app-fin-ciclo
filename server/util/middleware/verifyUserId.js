/**
 * @name verifyUserId
 * @description Middleware que verifica si el ID del usuario está presente en
 *              el objeto de solicitud (req).
 *              Si el ID del usuario no está presente, se envía una respuesta
 *              con el estado 403 y un mensaje de error.
 *              Si el ID del usuario está presente, se llama a la función
 *              next() para pasar al siguiente middleware o ruta.
 * @memberof Util-Middleware
 * @function
 */
export const verifyUserId = (req, res, next) => {
	if (!req.user_id) {
		return res.status(403).json({
			errors: ['Token inválido.'],
		});
	}
	next();
};
