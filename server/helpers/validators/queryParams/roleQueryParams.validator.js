// Importación de las librerías necesarias
import { query, validationResult } from 'express-validator';

/**
 * @name validateRoleQueryParams
 * @description Middleware que valida el parámetro de consulta 'role' y el parámetro de consulta 'search'.
 * @memberof Helpers-Validators-QueryParams
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateRoleQueryParams = [
	query('role').optional().isNumeric().withMessage('El rol debe ser un valor numérico.'),
	query('search').optional().isString().withMessage('El campo de búsqueda debe ser una cadena de texto.'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
