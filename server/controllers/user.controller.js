const UserService = require('../services/user.service');
const bcrypt = require('bcryptjs');

exports.postRegister = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) throw new Error('Email y contraseña son requeridos.');

        await UserService.createUser(email, password);

        res.status(200).json({ message: 'Usuario creado.'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) throw new Error('Email y contraseña son requeridos.');

        const user = await UserService.readUser(email);
        if (!user) throw new Error('Contraseña/Usuario incorrectos.');

        const match = bcrypt.compareSync(password, user.password);
        if (!match) throw new Error('Contraseña/Usuario incorrectos.');

        res.status(200).json({ message: 'Usuario autenticado.', user: user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}