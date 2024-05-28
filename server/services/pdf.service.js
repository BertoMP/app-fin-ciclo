// Importación de librerías necesarias
import { launch } from 'puppeteer';
import { existsSync, unlink, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import pkg from 'handlebars';
const { compile } = pkg;
import { fileURLToPath } from 'url';

// Definición de las constantes __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta de los templates
const templatesSource = join(__dirname, '../helpers/templates/pdf');
const tmpPdfPath = join(__dirname, '../tmp/pdfs');

/**
 * @class PdfService
 * @description Clase que contiene los métodos para la generación y destrucción de PDF.
 */
class PdfService {
	/**
	 * @method destroyPDF
	 * @description Método para eliminar un archivo PDF.
	 * @static
	 * @async
	 * @memberof PdfService
	 * @param {string} file - La ruta del archivo PDF a eliminar.
	 */
	static async destroyPDF(file) {
		if (existsSync(file)) {
			unlink(file, (unlinkError) => {
				if (unlinkError) {
					console.log(`Error al eliminar el archivo subido: ${unlinkError}`);
				}
			});
		} else {
			console.log(`El archivo no existe en: ${file}`);
		}
	}

	/**
	 * @method generateReceta
	 * @description Método para generar una receta en formato PDF.
	 * @static
	 * @async
	 * @memberof PdfService
	 * @param {Object} medicamentos - El objeto que contiene los datos de los medicamentos.
	 * @returns {Promise<string>} La ruta del archivo PDF generado.
	 */
	static async generateReceta(medicamentos) {
		const template = readFileSync(join(templatesSource, 'receta.handlebars'), 'utf8');
		const compiledTemplate = compile(template);
		const date = new Date();
		const monthNames = [
			'enero',
			'febrero',
			'marzo',
			'abril',
			'mayo',
			'junio',
			'julio',
			'agosto',
			'septiembre',
			'octubre',
			'noviembre',
			'diciembre',
		];

		medicamentos.fecha = `${date.getDate()} de ${
			monthNames[date.getMonth()]
		} de ${date.getFullYear()}`;

		const bodyHtml = compiledTemplate(medicamentos);
		const filename = `receta_${medicamentos.datos_paciente.nombre}_${medicamentos.datos_paciente.primer_apellido}_${medicamentos.datos_paciente.segundo_apellido}.pdf`;

		return await PdfService.#generatePDFWithTemplate(bodyHtml, filename);
	}

	/**
	 * @method generateInforme
	 * @description Método para generar un informe en formato PDF.
	 * @static
	 * @async
	 * @memberof PdfService
	 * @param {Object} informe - El objeto que contiene los datos del informe.
	 * @returns {Promise<string>} La ruta del archivo PDF generado.
	 */
	static async generateInforme(informe) {
		const template = readFileSync(join(templatesSource, 'informe.handlebars'), 'utf8');
		const compiledTemplate = compile(template);
		const bodyHtml = compiledTemplate(informe);

		const filename = `informe_${informe.datos_paciente.nombre}_${informe.datos_paciente.primer_apellido}_${informe.datos_paciente.segundo_apellido}.pdf`;

		return await PdfService.#generatePDFWithTemplate(bodyHtml, filename);
	}

	/**
	 * @method generateCitaPDF
	 * @description Método para generar un PDF de una cita.
	 * @static
	 * @async
	 * @memberof PdfService
	 * @param {Object} cita - El objeto que contiene los datos de la cita.
	 * @param {string} qr - El código QR para la cita.
	 * @returns {Promise<string>} La ruta del archivo PDF generado.
	 */
	static async generateCitaPDF(cita, qr) {
		const template = readFileSync(join(templatesSource, 'cita.handlebars'), 'utf8');
		const compiledTemplate = compile(template);
		const bodyHtml = compiledTemplate({ cita, qr });

		const filename = `cita_${cita.datos_paciente.nombre}_${cita.datos_paciente.primer_apellido}_${cita.datos_paciente.segundo_apellido}.pdf`;

		return await PdfService.#generatePDFWithTemplate(bodyHtml, filename);
	}

	/**
	 * @method generatePDFWithTemplate
	 * @description Método privado para generar un PDF con una plantilla.
	 * @static
	 * @async
	 * @memberof PdfService
	 * @param {string} bodyHtml - El contenido HTML del cuerpo del PDF.
	 * @param {string} filename - El nombre del archivo PDF.
	 * @returns {Promise<string>} La ruta del archivo PDF generado.
	 */
	static async #generatePDFWithTemplate(bodyHtml, filename) {
		const pdfPath = join(tmpPdfPath, filename);
		const dir = dirname(pdfPath);

		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}

		await PdfService.#generatePDF(bodyHtml, pdfPath);

		return pdfPath;
	}

	/**
	 * @method generatePDF
	 * @description Método privado para generar un PDF con contenido HTML, encabezado y pie de página.
	 * @static
	 * @async
	 * @memberof PdfService
	 * @param {string} bodyHtml - El contenido HTML del cuerpo del PDF.
	 * @param {string} pdfPath - La ruta donde se guardará el archivo PDF.
	 * @returns {Promise<void>} No devuelve nada.
	 */
	static async #generatePDF(bodyHtml, pdfPath) {
		const header = readFileSync(join(templatesSource, 'header.handlebars'), 'utf8');
		const compiledHeader = compile(header);

		const footer = readFileSync(join(templatesSource, 'footer.handlebars'), 'utf8');
		const compiledFooter = compile(footer);

		const headerHtml = compiledHeader({});
		const footerHtml = compiledFooter({});

		const page = await browser.newPage();
		await page.setContent(bodyHtml);

		const options = {
			format: 'A4',
			displayHeaderFooter: true,
			printBackground: true,
			headerTemplate: headerHtml,
			footerTemplate: footerHtml,
			margin: {
				top: '2cm',
				right: '2cm',
				bottom: '2cm',
				left: '2cm',
			},
		};

		await page.pdf({ path: pdfPath, ...options });

		await browser.close();
	}
}

// Exportación del servicio
export default PdfService;
