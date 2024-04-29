const EspecialidadService = require('../services/especialidad.service');

exports.getEspecialidades = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;

  try {
    const {
      rows: resultados,
      total: cantidad_especialidades,
      actualPage: pagina_actual,
      totalPages: paginas_totales
    } = await EspecialidadService.readEspecialidades(page, limit);

    if (page > 1 && page > paginas_totales) {
      return res.status(404).json({
        errors: ['La página de especialidades solicitada no existe.']
      });
    }

    const prev = page > 1
      ? `/especialidad?page=${page - 1}`
      : null;
    const next = page < paginas_totales
      ? `/especialidad?page=${page + 1}`
      : null;
    const result_min = (page - 1) * limit + 1;
    const result_max = resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
    const items_pagina = limit;

    return res.status(200).json({
      prev,
      next,
      pagina_actual,
      paginas_totales,
      cantidad_especialidades,
      items_pagina,
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

exports.getEspecialidadesEspecialistas = async (req, res) => {
  try {
    const especialidades = await EspecialidadService.readEspecialidesEspecialistas();

    if (!especialidades || especialidades.length === 0) {
      return res.status(404).json({
        errors: ['No se encontraron especialidades con especialistas.']
      });
    }

    return res.status(200).json(especialidades);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.createEspecialidad = async (req, res) => {
  let descripcion = req.body.descripcion;
  descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

  try {
    const especialidad = {
      nombre: req.body.nombre,
      descripcion: descripcion,
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

    return res.status(200).json({message: 'Especialidad creada exitosamente.'});
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.updateEspecialidad = async (req, res) => {
  const id = parseInt(req.params.especialidad_id);
  let descripcion = req.body.descripcion;
  descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

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
      descripcion: descripcion,
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