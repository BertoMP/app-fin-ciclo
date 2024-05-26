// Importación de las librerías necesarias
import { body, validationResult } from 'express-validator';

/**
 * @name validatePatologia
 * @description Middleware que valida el cuerpo de la solicitud para una patología.
 *              Valida 'nombre' y 'descripcion'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validatePatologia = [
	body('datos_patologia.nombre')
		.trim()
		.notEmpty()
		.withMessage('El nombre es obligatorio')
		.isString()
		.withMessage('El nombre debe ser una cadena de texto')
		.escape(),
	body('datos_patologia.descripcion')
		.trim()
		.notEmpty()
		.withMessage('La descripción es obligatoria')
		.isString()
		.withMessage('La descripción debe ser una cadena de texto'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
