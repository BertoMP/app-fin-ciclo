const EspecialidadService = require('../services/especialidad.service');
const destroyFile = require('../util/functions/destroyFile');

exports.getEspecialidades = async (req, res) => {
    const page = parseInt(req.query.page) || 1;

    try {
        const {
            rows: resultados,
            total: cantidad_especialidades,
            actualPage: pagina_actual,
            totalPages: paginas_totales
        } = await EspecialidadService.readEspecialidades(page);

        if (page > 1 && page > paginas_totales) {
            return res.status(404).json({
                errors: ['La página de especialidades solicitada no existe.']
            });
        }

        const prev = page > 1
            ? `/api/especialidad?page=${page - 1}`
            : null;
        const next = page < paginas_totales
            ? `/api/especialidad?page=${page + 1}`
            : null;
        const result_min = (page - 1) * 10 + 1;
        const result_max = resultados.length === 10 ? page * 10 : (page - 1) * 10 + resultados.length;

        return res.status(200).json({
            prev,
            next,
            pagina_actual,
            paginas_totales,
            cantidad_especialidades,
            result_min,
            result_max,
            resultados
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.getEspecialidadById = async (req, res) => {
    const id = parseInt(req.params.especialidad_id);

    try {
        const especialidad = await EspecialidadService.readEspecialidadById(id);

        if (!especialidad) {
            return res.status(404).json({
                errors: ['Especialidad no encontrada.']
            });
        }

        return res.status(200).json(especialidad);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.createEspecialidad = async (req, res) => {
    try {
        const especialidad = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            imagen: req.body.imagen
        }

        const especialidadExists =
            await EspecialidadService.readEspecialidadByNombre(especialidad.nombre);

        if (especialidadExists) {
            return res.status(409).json({
                errors: ['Ya existe una especialidad con ese nombre.']
            });
        }

        await EspecialidadService.createEspecialidad(especialidad);

        return res.status(201).json({ message: 'Especialidad creada exitosamente.' });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.updateEspecialidad = async (req, res) => {
    const id = parseInt(req.params.especialidad_id);

    try {
        const currentEspecialidad =
            await EspecialidadService.readEspecialidadById(id);

        if (!currentEspecialidad) {
            return res.status(404).json({
                errors: ['Especialidad no encontrada.']
            });
        }

        const especialidad = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            imagen: req.body.imagen
        }

        await EspecialidadService.updateEspecialidad(id, especialidad);

        return res.status(200).json({
            message: 'Especialidad actualizada exitosamente.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.deleteEspecialidad = async (req, res) => {
    const id = parseInt(req.params.especialidad_id);

    try {
        const currentEspecialidad =
            await EspecialidadService.readEspecialidadById(id);

        if (!currentEspecialidad) {
            return res.status(404).json({
                errors: ['Especialidad no encontrada.']
            });
        }

        await EspecialidadService.deleteEspecialidad(id);

        return res.status(200).json({
            message: 'Especialidad eliminada exitosamente.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}