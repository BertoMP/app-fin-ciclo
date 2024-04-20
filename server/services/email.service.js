const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const nodeMailer = require('nodemailer');

const templatesPath = path.join(__dirname, '../helpers/templates/email');

class EmailService {
    static async sendWelcomeEmail(to, name) {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const templatePath = path.join(templatesPath, 'welcome.handlebars');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);

        const html = template({name});

        const mailDetails = {
            from: process.env.EMAIL_ACCOUNT,
            to: to,
            subject: "Bienvenido a Clínica Médica Coslada",
            html: html
        }

        try {
            return await transporter.sendMail(mailDetails);
        } catch (err) {
            throw err;
        }
    }

    static async sendPasswordResetEmail(to, user, resetToken) {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const templatePath = path.join(templatesPath, 'reset-password.handlebars');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);

        const html = template({ user, resetLink: `${process.env.ANGULAR_HOST}/reset-password/${resetToken}` });

        const mailDetails = {
            from: "clinicamedicacoslada@gmail.com",
            to: to,
            subject: "Recuperar contraseña - Clínica Médica Coslada",
            html: html
        }

        try {
            return await transporter.sendMail(mailDetails);
        } catch (err) {
            throw err;
        }
    }

    static async sendContactEmail(contacto) {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const templatePath = path.join(templatesPath, 'contact.handlebars');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);

        const html = template({ contacto });

        const mailDetails = {
            from: process.env.EMAIL_ACCOUNT,
            to: process.env.EMAIL_ACCOUNT,
            subject: `Nuevo mensaje de contacto - ${contacto.nombre}`,
            html: html
        }

        try {
            return await transporter.sendMail(mailDetails);
        } catch (err) {
            throw err;
        }
    }

    static async sendPdfCita(newCita, emailPaciente, pdf) {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const templatePath = path.join(templatesPath, 'cita.handlebars');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(source);

        const html = template({ newCita });

        const mailDetails = {
            from: process.env.EMAIL_ACCOUNT,
            to: emailPaciente,
            subject: 'Confirmación de cita',
            html: html,
            attachments: [
                {
                    filename: `cita_${newCita.datos_paciente.nombre}_${newCita.datos_paciente.primer_apellido}_${newCita.datos_cita.fecha}.pdf`,
                    path: pdf
                }
            ]
        }

        try {
            return await transporter.sendMail(mailDetails);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = EmailService;