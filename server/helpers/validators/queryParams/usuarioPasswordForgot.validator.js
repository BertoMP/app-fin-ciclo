// Importación de los módulos necesarios
import {body, validationResult} from 'express-validator';

/**
 * @name validateUserPasswordForgot
 * @description Middleware que valida el cuerpo de la solicitud para la recuperación de contraseña de un usuario.
 * 						Valida 'email'.
 * 						Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 * 						Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateUserPasswordForgot = [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('El correo es requerido.')
		.custom((value) => {
			const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

			if (!regex.test(value)) {
				throw new Error('El correo debe ser un correo válido.');
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
