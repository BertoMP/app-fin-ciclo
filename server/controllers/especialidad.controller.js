const EspecialidadService = require('../services/especialidad.service');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

function destroyFile(filePath) {
    fs.unlink(path.join(__dirname, '..', filePath), unlinkError => {
        if (unlinkError) {
            console.log('Error al eliminar el archivo subido: ', unlinkError);
        }
    });
}

exports.validateEspecialidad = [
    body('nombre')
        .isString()
        .withMessage('El nombre de la especialidad es requerido.'),

    body('nombre')
        .notEmpty()
        .withMessage('El nombre de la especialidad no puede estar vacío.'),

    body('descripcion')
        .isString()
        .withMessage('La descripción de la especialidad es requerida.'),

    body('descripcion')
        .notEmpty()
        .withMessage('La descripción de la especialidad no puede estar vacía.'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            destroyFile(req.file.path);
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    }
];

exports.getEspecialidades = async (req, res) => {
    const page = parseInt(req.query.page) || 1;

    try {
        if (isNaN(page)) {
            throw new Error('Número de página inválido.');
        }

        const {
            rows: especialidades,
            total: cantidad_especialidades,
            totalPages: paginas_totales
        } =
            await EspecialidadService.readEspecialidades(page);
        const prev = page > 1
            ? `/api/especialidad?page=${page - 1}`
            : null;
        const next = page < paginas_totales
            ? `/api/especialidad?page=${page + 1}`
            : null;
        const result_min = (page - 1) * 10 + 1;
        const result_max = page * 10;

        res.status(200).json({
            prev,
            next,
            paginas_totales,
            cantidad_especialidades,
            result_min,
            result_max,
            especialidades
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getEspecialidadById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        const especialidad = await EspecialidadService.readEspecialidadById(id);
        res.status(200).json(especialidad);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.createEspecialidad = async (req, res) => {
    try {
        const imagenPath = req.file.path;
        const especialidad = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            imagen: imagenPath
        }

        const especialidadExists =
            await EspecialidadService
                .readEspecialidadByNombre(especialidad.nombre);

        if (especialidadExists) {
            throw new Error(
                'Ya existe una especialidad con ese nombre.'
            );
        }

        await EspecialidadService.createEspecialidad(especialidad);
        res.status(201).json({ message: 'Especialidad creada exitosamente.' });
    } catch (err) {
        destroyFile(req.file.path);
        res.status(400).json({ message: err.message });
    }
}

exports.updateEspecialidad = async (req, res) => {
    const id = parseInt(req.params.id);
    let oldFilePath;

    try {
        const currentEspecialidad =
            await EspecialidadService.readEspecialidadById(id);

        if (currentEspecialidad) {
            oldFilePath = currentEspecialidad.imagen;
        }

        const especialidad = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            imagen: req.file.path
        }

        await EspecialidadService.updateEspecialidad(id, especialidad);
        res.status(200).json({
            message: 'Especialidad actualizada exitosamente.'
        });

        if (oldFilePath) {
            destroyFile(oldFilePath);
        }
    } catch (err) {
        destroyFile(req.file.path);
        res.status(400).json({ message: err.message });
    }
}

exports.deleteEspecialidad = async (req, res) => {
    const id = parseInt(req.params.id);
    let oldFilePath;

    try {
        if (isNaN(id)) {
            throw new Error('Número de identificación inválido.');
        }

        const currentEspecialidad =
            await EspecialidadService.readEspecialidadById(id);

        if (!currentEspecialidad) {
            throw new Error('Especialidad no encontrada.');
        }

        oldFilePath = currentEspecialidad.imagen;

        await EspecialidadService.deleteEspecialidad(id);
        res.status(200).json({
            message: 'Especialidad eliminada exitosamente.'
        });

        if (oldFilePath) {
            destroyFile(oldFilePath);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}