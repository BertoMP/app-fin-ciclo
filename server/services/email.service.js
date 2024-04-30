const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const nodeMailer = require('nodemailer');

const templatesPath = path.join(__dirname, '../helpers/templates/email');

class EmailService {
  static async sendWelcomeEmail(to, name) {
    const transporter = this.createTransporter();
    const compiledTemplate = this.compileTemplate('welcome.handlebars', {name});

    const mailDetails = this.createMailDetails(
      process.env.EMAIL_ACCOUNT,
      to,
      "Bienvenido a Clínica Médica Coslada",
      compiledTemplate
    );

    try {
      return await transporter.sendMail(mailDetails);
    } catch (err) {
      throw err;
    }
  }

  static async sendPasswordResetEmail(to, user, resetToken) {
    const transporter = this.createTransporter();
    const compiledTemplate = this.compileTemplate('reset-password.handlebars', {
      user,
      resetLink: `${process.env.ANGULAR_HOST}:${process.env.ANGULAR_PORT}/auth/reset-password/${resetToken}`
    });

    const mailDetails = this.createMailDetails(
      "clinicamedicacoslada@gmail.com",
      to,
      "Recuperar contraseña - Clínica Médica Coslada",
      compiledTemplate
    );

    try {
      return await transporter.sendMail(mailDetails);
    } catch (err) {
      throw err;
    }
  }

  static async sendContactEmail(contacto) {
    const transporter = this.createTransporter();

    const compiledTemplate = this.compileTemplate('contact.handlebars', {contacto});

    const mailDetails = this.createMailDetails(
      process.env.EMAIL_ACCOUNT,
      process.env.EMAIL_ACCOUNT,
      `${contacto.descripcion}`,
      compiledTemplate
    );

    try {
      return await transporter.sendMail(mailDetails);
    } catch (err) {
      throw err;
    }
  }

  static async sendPdfCita(newCita, emailPaciente, pdf) {
    const transporter = this.createTransporter();

    const compiledTemplate = this.compileTemplate('cita.handlebars', {newCita});

    const mailDetails = this.createMailDetails(
      process.env.EMAIL_ACCOUNT,
      emailPaciente,
      'Confirmación de cita',
      compiledTemplate,
      [
        {
          filename: `cita_${newCita.datos_paciente.nombre}_${newCita.datos_paciente.primer_apellido}_${newCita.datos_cita.fecha}.pdf`,
          path: pdf
        }
      ]
    );

    try {
      return await transporter.sendMail(mailDetails);
    } catch (err) {
      throw err;
    }
  }

  static createTransporter() {
    return nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  static compileTemplate(templateName, data) {
    const templatePath = path.join(templatesPath, templateName);
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);

    return template(data);
  }

  static createMailDetails(from, to, subject, html, attachments = []) {
    return {
      from: from,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments
    };
  }
}

module.exports = EmailService;