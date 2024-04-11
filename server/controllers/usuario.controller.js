const UsuarioService = require('../services/usuario.service');
const PacienteService = require('../services/paciente.service');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postRegistro = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const user = {
            email: req.body.email,
            password: encryptedPassword,
            nombre: req.body.nombre,
            primer_apellido: req.body.primer_apellido,
            segundo_apellido: req.body.segundo_apellido,
            dni: req.body.dni,
            rol_id: req.body.rol ? req.body.rol : 2
        }

        const patient = {
            num_hist_clinica: await createHistClinica(),
            fecha_nacimiento: req.body.fecha_nacimiento,
            tipo_via: req.body.tipo_via,
            nombre_via: req.body.nombre_via,
            numero: req.body.numero,
            piso: req.body.piso,
            puerta: req.body.puerta,
            provincia: req.body.provincia,
            municipio: req.body.municipio,
            codigo_postal: req.body.codigo_postal,
            tel_fijo: req.body.tel_fijo,
            tel_movil: req.body.tel_movil
        }

        await UsuarioService.createUsuarioPaciente(user, patient);

        res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.postRegistroEspecialista = async (req, res) => {

}


exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UsuarioService.readUsuarioByEmail(email);
        if (!user) {
            throw new Error('Correo o contraseña incorrectos.');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new Error('Correo o contraseña incorrectos.');
        }

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token: createToken(user)
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.postUpdatePassword = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UsuarioService.readUsuarioByEmail(email);
        if (!user) {
            throw new Error('Correo no encontrado.');
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        await UsuarioService.updatePassword(email, encryptedPassword);
        res.status(200).json({
            message: 'Contraseña actualizada exitosamente.'
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


function createToken(user) {
    const payload = {
        user_email: user.email,
        user_primer_apellido: user.primer_apellido,
        user_role: user.rol_id
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    });
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

        histClinica = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${random}`;

        existedPatient = await PacienteService.readPacienteByNumHistClinica(histClinica);
    } while (existedPatient);

    return histClinica;
}