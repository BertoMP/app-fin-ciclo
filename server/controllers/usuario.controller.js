const UsuarioService = require('../services/usuario.service');
const PacienteService = require('../services/paciente.service');
const TokenService = require('../services/token.service');
const EmailService = require('../services/email.service');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fileDestroy = require('../util/functions/destroyFile');
const createToken = require('../helpers/jwt/createToken');
const createResetToken = require('../helpers/jwt/createResetToken');
const createRefreshToken = require('../helpers/jwt/createRefreshToken');
const getSearchValuesByRole = require("../util/functions/getSearchValuesByRole");

exports.getUsuario = async (req, res) => {
    let id = 0;
    let role_id = 0;

    if (req.user_role === 2) {
        id = req.user_id;
        role_id = 2;
    } else if (req.user_role === 1) {
        id = req.params.usuario_id;
    }

    try {
        if (!role_id) {
            role_id = await UsuarioService.readUsuarioRoleById(id);

            if (!role_id) {
                return res.status(404).json({
                    errors: ['Usuario no encontrado.']
                });
            }
        }

        if (role_id === 2) {
            const user = await UsuarioService.readUsuarioPaciente(id);

            if (!user) {
                return res.status(404).json({
                    errors: ['Usuario no encontrado.']
                });
            }

            return res.status(200).json(user);
        }

        const user = await UsuarioService.readUsuarioEspecialista(id);

        if (!user) {
            return res.status(404).json({
                errors: ['Usuario no encontrado.']
            });
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ errors: [err.message] });
    }
}

exports.getListado = async (req, res) => {
    try {
        const searchValues = getSearchValuesByRole(req);

        const page = searchValues.page;
        const role_id = searchValues.role;

        const {
            rows: resultados,
            actualPage: pagina_actual,
            total: cantidad_usuarios,
            totalPages: paginas_totales
        } =
            await UsuarioService.readAllUsuarios(searchValues);

        if (page > 1 && page > paginas_totales) {
            return res.status(404).json({
                errors: ['La página de usuarios solicitada no existe.']
            });
        }

        const prev = page > 1
            ? role_id
                ? `/api/usuario/listado?page=${page - 1}&role=${role_id}`
                : `/api/usuario/listado?page=${page - 1}`
            : null;
        const next = page < paginas_totales
            ? role_id
                ? `/api/usuario/listado?page=${page + 1}&role=${role_id}`
                : `/api/usuario/listado?page=${page + 1}`
            : null;
        const result_min = (page - 1) * 10 + 1;
        const result_max = resultados.length === 10 ? page * 10 : (page - 1) * 10 + resultados.length;

        const users = {
            prev,
            next,
            pagina_actual,
            paginas_totales,
            cantidad_usuarios,
            result_min,
            result_max,
            resultados
        }

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ errors: [err.message] });
    }
}

exports.postRegistro = async (req, res) => {
    try {
        const userExists = await UsuarioService.readUsuarioByEmail(req.body.email);

        if (userExists) {
            return res.status(409).json({
                errors: ['El correo ya está en uso.']
            });
        }

        const patientExists = await UsuarioService.readUsuarioByDNI(req.body.dni);

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

        await EmailService.sendWelcomeEmail(req.body.email, req.body.nombre);

        return res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (err) {
        return res.status(500).json({ errors: [err.message] });
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

        return res.status(500).json({ errors: [err.message] });
    }
}

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await UsuarioService.readUsuarioByEmail(email);
        if (!user) {
            return res.status(403).json({
                errors: ['Correo o contraseña incorrectos.']
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(403).json({
                errors: ['Correo o contraseña incorrectos.']
            });
        }

        const accessToken = createToken(user);
        const refreshToken = createRefreshToken(user);

        await UsuarioService.updateRefreshToken(email, refreshToken);

        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token: accessToken,
            refreshToken: refreshToken
        });
    } catch (err) {
        return res.status(500).json({ errors: [err.message] });
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
        return res.status(500).json({ errors: [err.message] });
    }
}

exports.postResetPassword = async (req, res) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_RESET_SECRET_KEY, async (err, decodedToken) => {
        if (err) {
            return res.status(403).json({
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
            return res.status(500).json({ errors: [err.message] });
        }
    });
}

exports.postUpdatePassword = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const id = req.user_id;

    try {
        const user = await UsuarioService.readUsuarioByEmail(email);

        if (!user) {
            return res.status(404).json({
                errors: ['Correo no encontrado.']
            });
        }

        if (user.id !== id) {
            return res.status(403).json({
                errors: ['No tienes permiso para realizar esta acción.']
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

exports.deleteUsuario = async (req, res) => {
    const id = req.user_id;

    try {
        await UsuarioService.deleteUsuario(id);

        return res.status(200).json({
            message: 'Usuario eliminado exitosamente.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.postRefreshToken = async (req, res) => {
    const refreshToken = req.body.refresh_token;

    if (!refreshToken) {
        return res.status(403).json({
            errors: ['No se proporcionó el token de actualización.']
        });
    }

    try {
        const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

        const user = await UsuarioService.readUsuarioById(decodedToken.user_id);
        if (!user) {
            return res.status(404).json({
                errors: ['Usuario no encontrado.']
            });
        }

        if (user.refresh_token !== refreshToken) {
            return res.status(403).json({
                errors: ['Token de actualización inválido.']
            });
        }

        const newAccessToken = createToken(user);
        const newRefreshToken = createRefreshToken(user);

        await UsuarioService.updateRefreshToken(user.email, newRefreshToken);

        return res.status(200).json({
            message: 'Token de acceso renovado exitosamente.',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        return res.status(403).json({
            errors: ['Token de actualización inválido.']
        });
    }
}

exports.postLogout = async (req, res) => {
    const userId = req.user_id;

    try {
        await UsuarioService.updateRefreshToken(userId, null);

        return res.status(200).json({ message: 'Cierre de sesión correcto.' });
    } catch (err) {
        return res.status(500).json({ errors: [err.message] });
    }
}

exports.putUsuarioPaciente = async (req, res) => {
    let usuario_id = 0;

    if (req.user_role === 2) {
        usuario_id = req.user_id;
    } else if (req.user_role === 1) {
        usuario_id = req.params.usuario_id;
    }

    try {
        const user = await validateUser(req, res, usuario_id);
        if (!user) return;

        const patientExists = await UsuarioService.readUsuarioByDNI(req.body.dni);

        if (patientExists && user.dni !== req.body.dni) {
            return res.status(409).json({
                errors: ['El DNI ya está en uso.']
            });
        }

        const userUpdate = {
            email: req.body.email,
            nombre: req.body.nombre,
            primer_apellido: req.body.primer_apellido,
            segundo_apellido: req.body.segundo_apellido,
            dni: req.body.dni
        }

        const patientUpdate = {
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

        await UsuarioService.updateUsuarioPaciente(userUpdate, patientUpdate);

        return res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
    } catch (err) {
        return res.status(500).json({ errors: [err.message] });
    }
}

exports.putUsuarioEspecialista = async (req, res) => {
    const id = req.params.usuario_id;

    try {
        const user = await validateUser(req, res, id);
        if (!user) return;

        const specialist = {
            email: req.body.email,
            nombre: req.body.nombre,
            primer_apellido: req.body.primer_apellido,
            segundo_apellido: req.body.segundo_apellido,
            dni: req.body.dni,
            num_colegiado: req.body.num_colegiado,
            descripcion: req.body.descripcion,
            turno: req.body.turno,
            especialidad_id: req.body.especialidad_id,
            consulta_id: req.body.consulta_id
        }

        if (req.file) {
            specialist.imagen = req.file.path;
        }

        await UsuarioService.updateUsuarioEspecialista(specialist);

        return res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
    } catch (err) {
        if (req.file) {
            fileDestroy(req.file.path);
        }

        return res.status(500).json({ errors: [err.message] });
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

async function validateUser(req, res, id) {
    const user = await UsuarioService.readUsuarioById(id);

    if (!user) {
        return res.status(404).json({
            errors: ['Usuario no encontrado.']
        });
    }

    const userExists = await UsuarioService.readUsuarioByEmail(req.body.email);

    if (userExists && user.email !== req.body.email) {
        return res.status(409).json({
            errors: ['El correo ya está en uso.']
        });
    }

    return user;
}