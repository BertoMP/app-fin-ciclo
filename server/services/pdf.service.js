const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const templatesSource = path.join(__dirname, '../helpers/templates/pdf');

class PdfService {
    static async generateReceta(medicamentos) {
        const template = fs.readFileSync(path.join(templatesSource, 'receta.handlebars'), 'utf8');
        const compiledTemplate = handlebars.compile(template);

        const date = new Date();
        medicamentos.dia = `${date.getDate()}`;

        const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        medicamentos.mes = monthNames[date.getMonth()];

        medicamentos.ano = `${date.getFullYear()}`;

        const bodyHtml = compiledTemplate(medicamentos);

        const filename = `receta_${medicamentos.datos_paciente.primer_apellido}_${medicamentos.datos_paciente.segundo_apellido}.pdf`;

        return await this.generatePDFWithTemplate(bodyHtml, filename);
    }

    static async generateInforme(informe) {
        const template = fs.readFileSync(path.join(templatesSource, 'informe.handlebars'), 'utf8');
        const compiledTemplate = handlebars.compile(template);

        const bodyHtml = compiledTemplate(informe);

        const filename = `informe_${informe.datos_paciente.primer_apellido}_${informe.datos_paciente.segundo_apellido}.pdf`;

        return await this.generatePDFWithTemplate(bodyHtml, filename);
    }

    static async generateCitaPDF(cita, qr) {
        const template = fs.readFileSync(path.join(templatesSource, 'cita.handlebars'), 'utf8');
        const compiledTemplate = handlebars.compile(template);

        const bodyHtml = compiledTemplate({ cita, qr });

        const filename = `cita_${cita.datos_paciente.nombre}_${cita.datos_paciente.primer_apellido}_${cita.datos_cita.fecha}.pdf`;

        return await this.generatePDFWithTemplate(bodyHtml, filename);
    }

    static async generatePDFWithTemplate(bodyHtml, filename) {
        const pdfPath = path.join(__dirname, `../tmp/pdfs/${filename}`);

        const dir = path.dirname(pdfPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await this.generatePDF(bodyHtml, pdfPath);

        return pdfPath;
    }

    static async generatePDF(bodyHtml, pdfPath) {
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

        const dir = path.dirname(pdfPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await page.pdf({ path: pdfPath, ...options });

        await browser.close();
    }
}

module.exports = PdfService;