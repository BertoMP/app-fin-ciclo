const PDFDocument = require('html-pdf');
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

        const html = compiledTemplate(medicamentos);

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
                top: '1cm',
                right: '3cm',
                bottom: '1cm',
                left: '3cm'
            },
            header: {
                "height": "25mm",
                "contents": '<div style="text-align: right;">Clínica Médica Coslada, SL</div>'
            },
            footer: {
                "height": "25mm",
                "contents": '<div style="text-align: center;">Clínica Médica Coslada, SL</div>'
            }
        };

        const pdf = PDFDocument.create(html, options);
        const pdfPath = path.join(__dirname, `../tmp/pdfs/receta_${medicamentos.datos_paciente.primer_apellido}_${medicamentos.datos_paciente.segundo_apellido}.pdf`);

        return PdfService.createDirectoryAndGeneratePdf(pdf, pdfPath);
    }

    static async generateInforme(informe) {
        const template = fs.readFileSync(path.join(templatesSource, 'informe.handlebars'), 'utf8');
        const compiledTemplate = handlebars.compile(template);

        const html = compiledTemplate(informe);

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
                top: '1cm',
                right: '3cm',
                bottom: '1cm',
                left: '3cm'
            },
            header: {
                "height": "25mm",
                "contents": '<div style="text-align: right;">Clínica Médica Coslada, SL</div>'
            },
            footer: {
                "height": "25mm",
                "contents": '<div style="text-align: center;">Clínica Médica Coslada, SL</div>'
            }
        };

        const pdf = PDFDocument.create(html, options);
        const pdfPath = path.join(__dirname, `../tmp/pdfs/informe_${informe.datos_paciente.primer_apellido}_${informe.datos_paciente.segundo_apellido}_${informe.datos_cita.fecha}.pdf`);

        const dir = path.dirname(pdfPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        return PdfService.createDirectoryAndGeneratePdf(pdf, pdfPath);
    }

    static async generateCitaPDF(cita, qr) {
        const template = fs.readFileSync(path.join(templatesSource, 'cita.handlebars'), 'utf8');
        const compiledTemplate = handlebars.compile(template);

        const html = compiledTemplate({ cita, qr });

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: {
                top: '1cm',
                right: '3cm',
                bottom: '1cm',
                left: '3cm'
            },
            header: {
                "height": "25mm",
                "contents": '<div style="text-align: right;">Clínica Médica Coslada, SL</div>'
            },
            footer: {
                "height": "25mm",
                "contents": '<div style="text-align: center;">Clínica Médica Coslada, SL</div>'
            }
        };

        const pdf = PDFDocument.create(html, options);
        const pdfPath = path.join(__dirname, `../tmp/pdfs/cita_${cita.datos_paciente.nombre}_${cita.datos_paciente.primer_apellido}_${cita.datos_cita.fecha}.pdf`);

        return PdfService.createDirectoryAndGeneratePdf(pdf, pdfPath);
    }

    static async createDirectoryAndGeneratePdf(pdf, pdfPath) {
        const dir = path.dirname(pdfPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
            pdf.toFile(pdfPath, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(pdfPath);
                }
            });
        });
    }
}

module.exports = PdfService;