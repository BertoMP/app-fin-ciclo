// Importación de los módulos necesarios
import { body } from 'express-validator';

/**
 * @name validateUserRegister
 * @description Middleware que valida el cuerpo de la solicitud para el registro de un usuario.
 *              Valida 'email', 'password', 'nombre', 'primer_apellido', 'segundo_apellido' y 'dni'.
 *              Si alguno de estos campos no es válido, se lanza un error con el mensaje correspondiente.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateUserRegister = [
	body('datos_personales.email')
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
	body('datos_personales.nombre')
		.trim()
		.notEmpty()
		.withMessage('El nombre es requerido.')
		.isString()
		.withMessage('El nombre debe ser una cadena de texto.')
		.escape(),
	body('datos_personales.primer_apellido')
		.trim()
		.notEmpty()
		.withMessage('El primer apellido es requerido.')
		.isString()
		.withMessage('El primer apellido debe ser una cadena de texto.')
		.escape(),
	body('datos_personales.segundo_apellido')
		.trim()
		.notEmpty()
		.withMessage('El segundo apellido es requerido.')
		.isString()
		.withMessage('El segundo apellido debe ser una cadena de texto.')
		.escape(),
	body('datos_personales.dni')
		.trim()
		.notEmpty()
		.withMessage('El DNI es requerido.')
		.isString()
		.withMessage('El DNI debe ser una cadena de texto.')
		.custom((value) => {
			const regex = /^[0-9]{8}[A-Z]$/;

			if (!regex.test(value)) {
				throw new Error('El DNI debe tener 8 dígitos y una letra mayúscula al final.');
			}

			return true;
		})
		.escape(),
];
