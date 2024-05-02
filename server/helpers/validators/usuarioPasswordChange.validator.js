// Importación de las librerías necesarias
import { body, validationResult } from 'express-validator';

/**
 * @name validateUserPasswordChange
 * @description Middleware que valida el cuerpo de la solicitud para el cambio de contraseña de un usuario.
 *              Valida 'password' y 'confirm_password'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateUserPasswordChange = [
	body('password')
		.trim()
		.notEmpty()
		.withMessage('La contraseña es requerida.')
		.isString()
		.withMessage('La contraseña debe ser una cadena de texto.')
		.custom((value) => {
			const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
			return regex.test(value);
		})
		.withMessage(
			'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.',
		),
	body('confirm_password')
		.trim()
		.notEmpty()
		.withMessage('La confirmación de la contraseña es requerida.')
		.isString()
		.withMessage('La confirmación de la contraseña debe ser una cadena de texto.')
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage('Las contraseñas no coinciden.'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
