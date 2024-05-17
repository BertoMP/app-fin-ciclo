// Importación de las librerías necesarias
import { query, validationResult } from 'express-validator';

/**
 * @name validateQueryParams
 * @description Middleware que valida los parámetros de consulta.
 * @memberof Helpers-Validators-QueryParams
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateQueryParams = [
	query('role')
		.optional()
		.isNumeric()
		.withMessage('El rol debe ser un valor numérico.'),
	query('page')
		.optional()
		.isNumeric()
		.withMessage('El número de página debe ser un valor numérico.'),
	query('limit')
		.optional()
		.isNumeric()
		.withMessage('El límite de elementos por página debe ser un valor numérico.'),
	query('search')
		.optional()
		.isString()
		.withMessage('El término de búsqueda debe ser una cadena de texto.'),
	query('fechaInicio')
		.optional()
		.isDate()
		.withMessage('La fecha de inicio debe ser una fecha válida.')
		.custom((value) => {
			if (value > new Date().toISOString().split('T')[0]) {
				throw new Error('La fecha de inicio no puede ser mayor a la fecha actual.');
			}

			return true;
		}),
	query('fechaFin')
		.optional()
		.isDate()
		.withMessage('La fecha de fin debe ser una fecha válida.')
		.custom((value, { req }) => {
			if (value > new Date().toISOString().split('T')[0]) {
				throw new Error('La fecha de fin no puede ser mayor a la fecha actual.');
			}

			if (value < req.query.fechaInicio) {
				throw new Error('La fecha de fin no puede ser menor a la fecha de inicio.');
			}

			return true;
		}),
	query('fechaCita')
		.optional()
		.isDate()
		.withMessage('La fecha de cita debe ser una fecha válida.')
		.custom((value) => {
			if (value < new Date().toISOString().split('T')[0]) {
				throw new Error('La fecha de cita no puede ser menor a la fecha actual.');
			}

			return true;
		}),
	query('especialistaId')
		.optional()
		.isNumeric()
		.withMessage('El id debe ser un número.')
		.custom((value) => {
			if (value <= 0) {
				throw new Error('El id debe ser un número positivo.');
			}

			return true;
		}),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
