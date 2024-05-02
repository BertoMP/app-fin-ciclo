// Importación de las librerías necesarias
import { toDataURL } from 'qrcode';

/**
 * @name generateQRCode
 * @description Genera un código QR a partir de la información de la cita.
 * @memberof Util-Functions
 * @function
 * @param {Object} cita - Objeto con los datos de la cita
 * @returns {Promise} - Código QR en formato base64
 */
export const generateQRCode = async (cita) => {
	try {
		const citaString = JSON.stringify(cita);
		return await toDataURL(citaString);
	} catch (err) {
		throw new Error('Error al generar el código QR.');
	}
};
