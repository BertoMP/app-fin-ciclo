const nodeMailer = require('nodemailer');

class EmailService {
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

        const mailDetails = {
            from: "clinicamedicacoslada@gmail.com",
            to: to,
            subject: "Recuperar contraseña - Clínica Médica Coslada",
            html: `
            <html>
                <head>
                    <title>Recuperar contraseña</title>
                    <style>
                        button {
                            background-color: #4CAF50;
                            color: white;
                            padding: 14px 20px;
                            border: none;
                            cursor: pointer;
                            border-radius: 4px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Recuperar contraseña</h1>
                    <p>Usuario ${user.nombre} ${user.primer_apellido} ${user.segundo_apellido},</p>
                    <p>Reciéntemente ha solicitado una recuperación de contraseña.
                    Para continuar con el proceso de recuperación, haga clic en
                    el siguiente enlace:</p>
                    <a href=${process.env.ANGULAR_HOST}/reset-password/${resetToken}>
                    <button>Recuperar contraseña</button>
                    </a>
                    <p>El enlace expirará en 1 hora. Por favor, actualice
                    su contraseña antes de ese tiempo.</p>
                    <p>Si no ha solicitado una recuperación de contraseña,
                    ignore este mensaje. Su contraseña no se cambiará.</p>
                    <p>Para cualquier duda o consulta póngase en contacto con
                    nosotros. Gracias.</p>
                    <p>Atentamente, Clínica Médica Coslada.</p>
                </body>
            </html>
            `
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

        const mailDetails = {
            from: process.env.EMAIL_ACCOUNT,
            to: process.env.EMAIL_ACCOUNT,
            subject: `Nuevo mensaje de contacto - ${contacto.nombre}`,
            html: `
        <html>
            <head>
                <title>Nuevo mensaje de contacto</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    th {
                        padding-top: 12px;
                        padding-bottom: 12px;
                        text-align: left;
                        background-color: #4CAF50;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <h1>Mensaje de contacto de ${contacto.nombre}</h1>
                <p>Se ha recibido un mensaje de contacto del siguiente remitente:</p>
                <table>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                    </tr>
                    <tr>
                        <td>${contacto.nombre}</td>
                        <td>${contacto.email}</td>
                        <td>${contacto.telefono}</td>
                    </tr>
                </table>
                <strong>Mensaje:</strong>
                <p>${contacto.mensaje}</p>
            </body>
        </html>
        `
        }

        try {
            return await transporter.sendMail(mailDetails);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = EmailService;