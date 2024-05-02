// Importación de las librerías necesarias
import { body, validationResult } from 'express-validator';

/**
 * @name validateContacto
 * @description Middleware que valida el cuerpo de la solicitud para un contacto.
 *              Valida 'nombre', 'descripcion', 'email', 'telefono' y 'mensaje'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateContacto = [
	body('nombre')
		.trim()
		.notEmpty()
		.withMessage('El nombre no puede estar vacío.')
		.isString()
		.withMessage('El nombre debe ser una cadena de texto.'),
	body('descripcion')
		.trim()
		.notEmpty()
		.withMessage('La descripción no puede estar vacía.')
		.isString()
		.withMessage('La descripción debe ser una cadena de texto.'),
	body('email')
		.trim()
		.notEmpty()
		.withMessage('El email no puede estar vacío.')
		.isEmail()
		.withMessage('El email debe ser válido.')
		.custom((value) => {
			const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

			if (!regex.test(value)) {
				throw new Error('El correo debe ser un correo válido.');
			}

			return true;
		}),
	body('telefono')
		.trim()
		.notEmpty()
		.withMessage('El teléfono no puede estar vacío.')
		.isNumeric()
		.withMessage('El teléfono debe ser un número.')
		.custom((value) => {
			const regex = /^((\+34|0034|34)-)?[679]\d{8}$/;

			if (!regex.test(value)) {
				throw new Error('El teléfono debe ser un teléfono válido.');
			}

			return true;
		}),
	body('mensaje')
		.trim()
		.notEmpty()
		.withMessage('El mensaje no puede estar vacío.')
		.isString()
		.withMessage('El mensaje debe ser una cadena de texto.'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
