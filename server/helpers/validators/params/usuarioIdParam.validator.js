// Importación las librerías necesarias
import { param, validationResult } from 'express-validator';

/**
 * @name validateUsuarioIdParam
 * @description Middleware que valida el parámetro 'usuario_id' en la ruta.
 *              Si 'usuario_id' no es numérico o es menor que 1, se envía una respuesta
 *              con el estado 400 y un mensaje de error.
 *              Si 'usuario_id' es válido, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Params
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateUsuarioIdParam = [
	param('usuario_id')
		.trim()
		.isNumeric()
		.withMessage('El ID del usuario debe ser un valor numérico.')
		.custom((value) => {
			if (value < 1) {
				throw new Error('El ID del usuario debe ser un valor positivo.');
			}

			return true;
		})
		.escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
