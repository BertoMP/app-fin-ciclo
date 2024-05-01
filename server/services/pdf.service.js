// Importación de librerías necesarias
const puppeteer         = require('puppeteer');
const fs                = require('fs');
const path              = require('path');
const handlebars        = require('handlebars');

// Ruta de los templates
const templatesSource   = path.join(__dirname, '../helpers/templates/pdf');
const tmpPdfPath        = path.join(__dirname, '../tmp/pdfs');

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
    if (fs.existsSync(file)) {
      fs.unlink(file, unlinkError => {
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
    const template = fs.readFileSync(path.join(templatesSource, 'receta.handlebars'), 'utf8');
    const compiledTemplate = handlebars.compile(template);
    const date = new Date();
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    medicamentos.fecha = `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;

    const bodyHtml = compiledTemplate(medicamentos);
    const filename = `receta_${medicamentos.datos_paciente.nombre}_${medicamentos.datos_paciente.primer_apellido}_${medicamentos.datos_paciente.segundo_apellido}.pdf`;

    return await this.#generatePDFWithTemplate(bodyHtml, filename);
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
    const template = fs.readFileSync(path.join(templatesSource, 'informe.handlebars'), 'utf8');
    const compiledTemplate = handlebars.compile(template);
    const bodyHtml = compiledTemplate(informe);
    const filename = `informe_${informe.datos_paciente.nombre}_${informe.datos_paciente.primer_apellido}_${informe.datos_paciente.segundo_apellido}.pdf`;

    return await this.#generatePDFWithTemplate(bodyHtml, filename);
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
    const template = fs.readFileSync(path.join(templatesSource, 'cita.handlebars'), 'utf8');
    const compiledTemplate = handlebars.compile(template);
    const bodyHtml = compiledTemplate({cita, qr});
    const filename = `cita_${cita.datos_paciente.nombre}_${cita.datos_paciente.primer_apellido}_${cita.datos_paciente.segundo_apellido}.pdf`;

    return await this.#generatePDFWithTemplate(bodyHtml, filename);
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
    const pdfPath = path.join(tmpPdfPath, filename);
    const dir = path.dirname(pdfPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }

    await this.#generatePDF(bodyHtml, pdfPath);

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
    const header = fs.readFileSync(path.join(templatesSource, 'header.handlebars'), 'utf8');
    const compiledHeader = handlebars.compile(header);

    const footer = fs.readFileSync(path.join(templatesSource, 'footer.handlebars'), 'utf8');
    const compiledFooter = handlebars.compile(footer);

    const headerHtml = compiledHeader({});
    const footerHtml = compiledFooter({});

    const browser = await puppeteer.launch();
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
        right: '3cm',
        bottom: '2cm',
        left: '3cm'
      },
    };

    await page.pdf({path: pdfPath, ...options});

    await browser.close();
  }
}

// Exportación del servicio
module.exports = PdfService;