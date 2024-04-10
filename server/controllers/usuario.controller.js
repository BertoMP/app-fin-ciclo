const UsuarioService = require('../services/usuario.service');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.validateUsuarioLogin = [
    body('email')
        .isEmail()
        .withMessage('El correo debe ser un correo válido.'),

    body('email')
        .notEmpty()
        .withMessage('El correo es requerido.'),

    body('password')
        .isString()
        .withMessage('La contraseña debe ser una cadena de texto.'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateUsuario = [
    body('email')
        .isEmail()
        .withMessage('El correo debe ser un correo válido.'),

    body('email')
        .notEmpty()
        .withMessage('El correo es requerido.'),

    body('password')
        .isString()
        .withMessage('La contraseña debe ser una cadena de texto.'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida.'),

    body('password')
        .isString()
        .notEmpty()
        .custom((value) => {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            return regex.test(value);
        })
        .withMessage(
            'La contraseña debe tener al menos 8 caracteres, una letra' +
            'mayúscula, una letra minúscula y un número.'
        ),

    body('nombre')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto.'),

    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido.'),

    body('primer_apellido')
        .isString()
        .withMessage('El primer apellido debe ser una cadena de texto.'),

    body('primer_apellido')
        .notEmpty()
        .withMessage('El primer apellido es requerido.'),

    body('segundo_apellido')
        .isString()
        .withMessage('El segundo apellido debe ser una cadena de texto.'),

    body('segundo_apellido')
        .notEmpty()
        .withMessage('El segundo apellido es requerido.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.postRegistro = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const userExists =
            await UsuarioService.readUsuarioByEmail(req.body.email);

        if (userExists) {
            throw new Error('El correo ya está registrado.');
        }

        const usuario = {
            email: req.body.email,
            password: encryptedPassword,
            nombre: req.body.nombre,
            primer_apellido: req.body.primer_apellido,
            segundo_apellido: req.body.segundo_apellido,
            rol_id: req.body.rol ? req.body.rol : 2
        }

        await UsuarioService.createUsuario(usuario);
        res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
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