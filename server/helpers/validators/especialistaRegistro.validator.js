// Importación de las librerías necesarias
import { body, validationResult } from 'express-validator';

// Importación de los validadores necesarios
import { validateUserRegister } from './usuarioRegistro.validator.js';

/**
 * @name validateEspecialistaRegister
 * @description Middleware que valida el cuerpo de la solicitud para el registro de un especialista.
 *              Valida 'num_colegiado', 'descripcion', 'turno', 'especialidad_id', 'consulta_id' e 'imagen'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validateEspecialistaRegister = [
	validateUserRegister,
	body('datos_especialista.num_colegiado')
		.trim()
		.notEmpty()
		.withMessage('El número de colegiado es requerido.')
		.isNumeric()
		.withMessage('El número de colegiado debe ser un valor numérico.')
		.custom((value) => {
			const regex = /^\d{9}$/;

			if (!regex.test(value)) {
				throw new Error('El número de colegiado debe tener 9 dígitos.');
			}

			if (value < 1) {
				throw new Error('El número de colegiado no puede ser 0 o negativo.');
			}

			console.log('value', value)

			return true;
		}),
	body('datos_especialista.descripcion')
		.trim()
		.notEmpty()
		.withMessage('La descripción es requerida.')
		.isString()
		.withMessage('La descripción debe ser una cadena de texto.'),
	body('datos_especialista.turno')
		.trim()
		.notEmpty()
		.withMessage('El turno es requerido.')
		.isString()
		.withMessage('El turno debe ser una cadena de texto.'),
	body('datos_especialista.especialidad.especialidad_id')
		.trim()
		.notEmpty()
		.withMessage('La especialidad es requerida.')
		.isNumeric()
		.withMessage('La especialidad debe ser un valor numérico.'),
	body('datos_especialista.consulta.consulta_id')
		.trim()
		.notEmpty()
		.withMessage('La consulta es requerida.')
		.isNumeric()
		.withMessage('La consulta debe ser un valor numérico.'),
	body('datos_especialista.imagen')
		.trim()
		.notEmpty()
		.withMessage('La imagen del especialista no puede estar vacía.')
		.isString()
		.withMessage('La imagen del especialista es requerida.'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.validationErrors = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: req.validationErrors });
		}
		next();
	},
];
