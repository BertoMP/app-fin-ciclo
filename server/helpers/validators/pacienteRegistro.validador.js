// Importación de las librerías necesarias
import { body, validationResult } from 'express-validator';

// Importación de los validadores necesarios
import { validateUserRegister } from './usuarioRegistro.validator.js';
import {log} from "qrcode/lib/core/galois-field.js";

/**
 * @name validatePacienteRegister
 * @description Middleware que valida el cuerpo de la solicitud para el registro de un paciente.
 *              Valida 'tipo_via', 'nombre_via', 'numero', 'piso', 'puerta', 'codigo_postal', 'municipio', 'tel_fijo', 'tel_movil', y 'fecha_nacimiento'.
 *              Si alguno de estos campos no es válido, se envía una respuesta con el estado 400 y los mensajes de error.
 *              Si todos los campos son válidos, se llama a la función next() para pasar al siguiente middleware o ruta.
 * @memberof Helpers-Validators-Body
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función de callback para pasar al siguiente middleware o ruta.
 */
export const validatePacienteRegister = [
	validateUserRegister,
	body('datos_personales.password')
		.trim()
		.notEmpty()
		.withMessage('La contraseña es requerida.')
		.isString()
		.withMessage('La contraseña debe ser una cadena de texto.')
		.custom((value) => {
			const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+=\[\]{}|;:,.<>?\/]).{8,}$/;

			if (!regex.test(value)) {
				throw new Error(
					'La contraseña debe tener al menos 8 caracteres: una letra mayúscula, una letra minúscula, un carácter especial y un número.',
				);
			}

			return true;
		})
		.escape(),
	body('datos_paciente.datos_vivienda.tipo_via.id')
		.trim()
		.notEmpty()
		.withMessage('El tipo de vía es requerido.')
		.isNumeric()
		.withMessage('El tipo de vía ha de ser un valor numérico')
		.escape(),
	body('datos_paciente.datos_vivienda.nombre_via')
		.trim()
		.notEmpty()
		.withMessage('El nombre de la vía es requerido.')
		.isString()
		.withMessage('El nombre de la vía debe ser una cadena de texto.')
		.escape(),
	body('datos_paciente.datos_vivienda.numero')
		.trim()
		.notEmpty()
		.withMessage('El número es requerido.')
		.isNumeric()
		.withMessage('El número debe ser un valor numérico.')
		.custom((value) => {
			if (value < 1) {
				throw new Error('El número no puede ser 0 o negativo.');
			}
			return true;
		})
		.escape(),
	body('datos_paciente.datos_vivienda.piso')
		.trim()
		.notEmpty()
		.withMessage('El piso es requerido.')
		.isNumeric()
		.withMessage('El piso debe ser un valor numérico.')
		.custom((value) => {
			if (value < 1) {
				throw new Error('El piso no puede ser 0 o negativo.');
			}
			return true;
		})
		.escape(),
	body('datos_paciente.datos_vivienda.puerta')
		.trim()
		.isString()
		.withMessage('La puerta debe ser una cadena de texto.')
		.isString()
		.withMessage('La puerta debe ser una cadena de texto.')
		.custom((value) => {
			const regex = /^[1-9]\d?|[A-Z]$/;

			if (!regex.test(value)) {
				throw new Error('La puerta debe ser una letra mayúscula.');
			}
			return true;
		})
		.escape(),
	body('datos_paciente.datos_vivienda.municipio.codigo_postal')
		.trim()
		.notEmpty()
		.withMessage('El código postal es requerido.')
		.isNumeric()
		.withMessage('El código postal debe ser un valor numérico.')
		.custom((value) => {
			const regex = /^[0-9]{5}$/;

			if (!regex.test(value)) {
				throw new Error('El código postal debe tener 5 dígitos.');
			}
			return true;
		})
		.escape(),
	body('datos_paciente.datos_vivienda.municipio.id')
		.trim()
		.notEmpty()
		.withMessage('El municipio es requerido.')
		.isNumeric()
		.withMessage('El municipio debe ser un valor numérico.'),
	body('datos_paciente.datos_contacto.tel_fijo')
		.trim()
		.notEmpty()
		.withMessage('El teléfono fijo es requerido.')
		.isString()
		.withMessage('El teléfono fijo debe ser una cadena de texto.')
		.custom((value) => {
			const regex = /^((\+34|0034|34)-)?9[0-9]{8}$/;

			if (!regex.test(value)) {
				throw new Error('El teléfono fijo debe tener 9 dígitos.');
			}
			return true;
		})
		.escape(),
	body('datos_paciente.datos_contacto.tel_movil')
		.trim()
		.notEmpty()
		.withMessage('El teléfono móvil es requerido.')
		.isString()
		.withMessage('El teléfono móvil debe ser una cadena de texto.')
		.custom((value) => {
			const regex = /^((\+34|0034|34)-)?[6|7][0-9]{8}$/;

			if (!regex.test(value)) {
				throw new Error('El teléfono móvil debe tener 9 dígitos.');
			}
			return true;
		})
		.escape(),
	body('datos_paciente.fecha_nacimiento')
		.trim()
		.notEmpty()
		.withMessage('La fecha de nacimiento es requerida.')
		.isDate()
		.withMessage('La fecha de nacimiento debe ser una fecha válida.')
		.custom((value) => {
			const fecha_nacimiento = new Date(value);
			const fecha_actual = new Date();
			let edad = fecha_actual.getFullYear() - fecha_nacimiento.getFullYear();

			const mes = fecha_actual.getMonth() - fecha_nacimiento.getMonth();
			if (mes < 0 || (mes === 0 && fecha_actual.getDate() < fecha_nacimiento.getDate())) {
				edad--;
			}

			if (edad > 120) {
				throw new Error('La edad del paciente no puede ser mayor a 120 años.');
			} else if (edad < 0) {
				throw new Error('La edad no puede ser negativa');
			}

			return true;
		})
		.escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((error) => error.msg);

			return res.status(400).json({ errors: errorMessages });
		}
		next();
	},
];
