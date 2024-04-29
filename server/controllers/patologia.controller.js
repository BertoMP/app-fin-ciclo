const PatologiaService = require('../services/patologia.service');

exports.getPatologiasInforme = async (req, res) => {
  try {
    const patologias = await PatologiaService.readPatologiasInforme();

    return res.status(200).json(patologias);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }

}

exports.getPatologias = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const {
      rows: resultados,
      actualPage: pagina_actual,
      total: cantidad_patologias,
      totalPages: paginas_totales
    } = await PatologiaService.readPatologias(page, limit);

    if (page > 1 && page > paginas_totales) {
      return res.status(404).json({
        errors: ['La página de patologías solicitada no existe.']
      });
    }

    const prev = page > 1
      ? `/patologia?page=${page - 1}`
      : null;
    const next = page < paginas_totales
      ? `/patologia?page=${page + 1}`
      : null;
    const result_min = (page - 1) * limit + 1;
    const result_max = resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;

    return res.status(200).json({
      prev,
      next,
      pagina_actual,
      paginas_totales,
      cantidad_patologias,
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

exports.getPatologiaById = async (req, res) => {
  const id = parseInt(req.params.patologia_id);

  try {
    const patologia = await PatologiaService.readPatologiaById(id);

    if (!patologia) {
      return res.status(404).json({
        errors: ['La patología solicitada no existe.']
      });
    }

    return res.status(200).json(patologia);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.createPatologia = async (req, res) => {
  let descripcion = req.body.descripcion;
  descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

  const patologia = {
    nombre: req.body.nombre,
    descripcion: descripcion
  }

  try {
    const patologiaExists = await PatologiaService.readPatologiaByNombre(patologia.nombre);

    if (patologiaExists) {
      return res.status(409).json({
        errors: ['La patología ya existe.']
      });
    }

    await PatologiaService.createPatologia(patologia);

    return res.status(200).json({
      message: 'Patología creada correctamente.'
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.updatePatologia = async (req, res) => {
  const id = parseInt(req.params.patologia_id);

  let descripcion = req.body.descripcion;
  descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

  const patologia = {
    nombre: req.body.nombre,
    descripcion: descripcion
  }

  try {
    const currentPatologia = await PatologiaService.readPatologiaById(id);

    if (!currentPatologia) {
      return res.status(404).json({
        errors: ['La patología solicitada no existe.']
      });
    }

    const patologiaExists = await PatologiaService.readPatologiaByNombre(patologia.nombre);

    if (patologiaExists && patologiaExists.id !== id) {
      return res.status(409).json({
        errors: ['La patología ya existe.']
      });
    }

    await PatologiaService.updatePatologia(id, patologia);

    return res.status(200).json({
      message: 'Patología actualizada correctamente.'
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}