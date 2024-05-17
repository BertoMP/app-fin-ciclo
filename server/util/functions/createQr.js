// Importación de las librerías necesarias
import { toDataURL } from 'qrcode';

/**
 * @name generateQRCode
 * @description Genera un código QR a partir de la información de la cita.
 * @memberof Util-Functions
 * @function
 * @param {Object} data - Objeto con los datos a formatear en el código QR.
 * @returns {Promise} - Código QR en formato base64
 */
export const generateQRCode = async (data) => {
	try {
		const citaString = JSON.stringify(data);
		return await toDataURL(citaString);
	} catch (err) {
		throw new Error('Error al generar el código QR.');
	}
};
