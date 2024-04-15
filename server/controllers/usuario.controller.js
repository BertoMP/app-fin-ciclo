const UsuarioService = require('../services/usuario.service');
const PacienteService = require('../services/paciente.service');
const TokenService = require('../services/token.service');
const EmailService = require('../services/email.service');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fileDestroy = require('../util/functions/destroyFile');
const createToken = require('../util/jwt/createToken');
const createResetToken = require('../util/jwt/createResetToken');

exports.postRegistro = async (req, res) => {
    try {
        const userExists = await UsuarioService.readUsuarioByEmail(req.body.email);

        if (userExists) {
            return res.status(409).json({
                errors: ['El correo ya está en uso.']
            });
        }

        const patientExists = await PacienteService.readPacienteByDni(req.body.dni);

        if (patientExists) {
            return res.status(409).json({
                errors: ['El DNI ya está en uso.']
            });
        }

        const encryptedPassword = await createEncryptedPassword(req.body.password);
        const user = createUserObject(req, encryptedPassword, 2);

        const patient = {
            num_hist_clinica: await createHistClinica(),
            fecha_nacimiento: req.body.fecha_nacimiento,
            tipo_via: req.body.tipo_via,
            nombre_via: req.body.nombre_via,
            numero: req.body.numero,
            piso: req.body.piso,
            puerta: req.body.puerta,
            municipio: req.body.municipio,
            codigo_postal: req.body.codigo_postal,
            tel_fijo: req.body.tel_fijo,
            tel_movil: req.body.tel_movil
        }

        await UsuarioService.createUsuarioPaciente(user, patient);

        return res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.postRegistroEspecialista = async (req, res) => {
    try {
        const userExists = await UsuarioService.readUsuarioByEmail(req.body.email);

        if (userExists) {
            return res.status(409).json({
                errors: ['El correo ya está en uso.']
            });
        }

        const encryptedPassword = await createEncryptedPassword(req.body.password);
        const user = createUserObject(req, encryptedPassword, 3);

        const specialist = {
            num_colegiado: req.body.num_colegiado,
            descripcion: req.body.descripcion,
            imagen: req.file.path,
            turno: req.body.turno,
            especialidad_id: req.body.especialidad_id,
            consulta_id: req.body.consulta_id
        }

        await UsuarioService.createUsuarioEspecialista(user, specialist);

        return res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (err) {
        if (req.file) {
            fileDestroy(req.file.path);
        }

        return res.status(500).json({ message: err.message });
    }
}

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UsuarioService.readUsuarioByEmail(email);
        if (!user) {
            return res.status(401).json({
                errors: ['Correo o contraseña incorrectos.']
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                errors: ['Correo o contraseña incorrectos.']
            });
        }

        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token: createToken(user)
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.postForgotPassword = async (req, res) => {
    const email = req.body.email;

    try {
        const user = await UsuarioService.readUsuarioByEmail(email);
        if (!user) {
            return res.status(404).json({
                errors: ['Correo no encontrado en la base de datos.']
            });
        }

        const idUser = user.id;
        const resetToken = createResetToken(user);

        await TokenService.createToken(idUser, resetToken);

        await EmailService.sendPasswordResetEmail(email, user, resetToken);

        return res.status(200).json({
            message: 'Correo enviado exitosamente.'
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.postResetPassword = async (req, res) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
        if (err) {
            return res.status(500).json({
                errors: ['Token invalido o expirado.']
            });
        }

        try {
            const user = await UsuarioService.readUsuarioByEmail(decodedToken.email);

            if (!user) {
                return res.status(404).json({
                    errors: ['Usuario no encontrado.']
                });
            }

            const encryptedPassword = await createEncryptedPassword(newPassword);
            await UsuarioService.updatePassword(user.email, encryptedPassword);

            return res.status(200).json({
                message: 'Contraseña actualizada exitosamente.'
            });
        } catch (err) {
            return res.status(500).json({
                errors: [{ message: err.message }]
            });
        }
    });
}


exports.postUpdatePassword = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UsuarioService.readUsuarioByEmail(email);

        if (!user) {
            return res.status(404).json({
                errors: ['Correo no encontrado.']
            });
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        await UsuarioService.updatePassword(email, encryptedPassword);

        return res.status(200).json({
            message: 'Contraseña actualizada exitosamente.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

async function createEncryptedPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

function createUserObject(req, encryptedPassword, rol_id) {
    return {
        email: req.body.email,
        password: encryptedPassword,
        nombre: req.body.nombre,
        primer_apellido: req.body.primer_apellido,
        segundo_apellido: req.body.segundo_apellido,
        dni: req.body.dni,
        rol_id: rol_id
    };
}

async function createHistClinica() {
    let existedPatient;
    let histClinica;

    do {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

        const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        histClinica =
            `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${random}`;

        existedPatient =
            await PacienteService.readPacienteByNumHistClinica(histClinica);
    } while (existedPatient);

    return histClinica;
}