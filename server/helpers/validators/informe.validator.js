// Importación de las librerías necesarias
import { body, validationResult } from 'express-validator';

/**
 * @name validateInforme
 * @description Middleware que valida el cuerpo de la solicitud para un informe.
 *              Valida 'cita_id', 'motivo', 'patologias', 'patologias.*' y 'contenido'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateInforme = [
	body('cita_id')
		.trim()
		.notEmpty()
		.withMessage('La cita es requerida.')
		.isNumeric()
		.withMessage('La cita debe ser un número.'),
	body('motivo')
		.trim()
		.notEmpty()
		.withMessage('El motivo es requerido.')
		.isString()
		.withMessage('El motivo debe ser un texto.'),
	body('patologias').isArray().withMessage('Las patologías deben ser un arreglo de texto.'),
	body('patologias.*')
		.trim()
		.notEmpty()
		.withMessage('El id de la patología es requerido.')
		.isNumeric()
		.withMessage('El id de la patología debe ser un número.'),
	body('contenido')
		.trim()
		.notEmpty()
		.withMessage('El contenido es requerido.')
		.isString()
		.withMessage('El contenido debe ser un texto.'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
