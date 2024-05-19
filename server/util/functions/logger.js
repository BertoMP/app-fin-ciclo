/**
 * @name generateLogFileName
 * @description Genera el nombre del archivo de registro de acceso.
 * @memberof Util-Functions
 * @function
 * @returns {string} - Nombre del archivo de registro de acceso
 */
export const generateLogFileName = () => {
	const time = new Date();

	const year = time.getFullYear();
	const month = (time.getMonth() + 1).toString().padStart(2, '0');
	const day = time.getDate().toString().padStart(2, '0');

	return "access" + year + "-" + month + "-" + day + ".log";
}
