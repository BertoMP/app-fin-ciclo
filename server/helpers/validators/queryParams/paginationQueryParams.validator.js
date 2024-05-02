// Importación de las librerías necesarias
import { query, validationResult } from 'express-validator';

/**
 * @name validatePaginationQueryParams
 * @description Middleware que valida el parámetro de consulta 'page'.
 *              Si 'page' no es numérico, se envía una respuesta con el estado 400 y un mensaje de error.
 *              Si 'page' es válido o no se proporciona, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-QueryParams
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validatePaginationQueryParams = [
	query('page')
		.optional()
		.isNumeric()
		.withMessage('El número de página debe ser un valor numérico.'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
