// Importación de las librerías necesarias
import { body, validationResult } from 'express-validator';

/**
 * @name validateGlucometria
 * @description Middleware que valida el cuerpo de la solicitud para una glucometría.
 *              Valida 'medicion' que debe ser un valor numérico entre 2 y 3 dígitos y no puede ser un valor negativo.
 *              Si 'medicion' no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si 'medicion' es válido, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateGlucometria = [
	body('tomas.medicion')
		.trim()
		.notEmpty()
		.withMessage('La medición es requerida.')
		.isNumeric()
		.withMessage('La medición debe ser un valor numérico.')
		.custom((value) => {
			if (value < 0) {
				throw new Error('La medición no puede ser un valor negativo.');
			}

			const regex = /^\d{2,3}$/;
			if (!regex.test(value)) {
				throw new Error('La medición debe tener entre 2 y 3 dígitos.');
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
