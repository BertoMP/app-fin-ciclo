// Importación de los servicios necesarios
const ConsultaService       = require('../services/consulta.service');
const EspecialistaService   = require('../services/especialista.service');

exports.getConsultas = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const {
      rows: resultados,
      total: cantidad_consultas,
      actualPage: pagina_actual,
      totalPages: paginas_totales
    } = await ConsultaService.readConsultas(page, limit);

    if (page > 1 && page > paginas_totales) {
      return res.status(404).json({
        errors: ['La página de consultas solicitada no existe.']
      });
    }

    const prev = page > 1
      ? `/consulta?page=${page - 1}`
      : null;
    const next = page < paginas_totales
      ? `/consulta?page=${page + 1}`
      : null;
    const result_min = (page - 1) * limit + 1;
    const result_max = resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
    const items_pagina = limit;

    return res.status(200).json({
      prev,
      next,
      pagina_actual,
      paginas_totales,
      cantidad_consultas,
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

exports.getConsultaById = async (req, res) => {
  const id = parseInt(req.params.consulta_id);

  try {
    const consulta = await ConsultaService.readConsultaById(id);

    if (!consulta) {
      return res.status(404).json({
        errors: ['Consulta no encontrada.']
      });
    }

    return res.status(200).json(consulta);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.createConsulta = async (req, res) => {
  try {
    const consulta = {
      nombre: req.body.nombre,
      id_medico: req.body.id_medico,
    }

    const consultaExists = await ConsultaService.readConsultaByName(consulta.nombre);

    if (consultaExists) {
      return res.status(409).json({
        errors: ['Ya existe una consulta con ese nombre.']
      });
    }

    await ConsultaService.createConsulta(consulta);

    return res.status(200).json({
      message: 'Consulta creada correctamente.'
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.updateConsulta = async (req, res) => {
  const id = parseInt(req.params.consulta_id);

  try {
    const consultaExists = await ConsultaService.readConsultaById(id);

    if (!consultaExists) {
      return res.status(404).json({
        errors: ['La consulta no existe.']
      });
    }

    const consultaNombre = await ConsultaService.readConsultaByName(req.body.nombre);

    if (consultaNombre) {
      return res.status(409).json({
        errors: ['Ya existe una consulta con ese nombre.']
      });
    }

    const consulta = {
      nombre: req.body.nombre,
      id_medico: req.body.id_medico,
    }

    await ConsultaService.updateConsulta(id, consulta);

    return res.status(200).json({
      message: 'Consulta actualizada correctamente.'
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.deleteConsulta = async (req, res) => {
  const id = parseInt(req.params.consulta_id);

  try {
    const consulta = await ConsultaService.readConsultaById(id);

    if (!consulta) {
      return res.status(404).json({
        errors: ['La consulta no existe.']
      });
    }

    const especialistaAsociado =
      await EspecialistaService.readEspecialistaByConsultaId(id);

    if (especialistaAsociado) {
      return res.status(409).json({
        errors: ['No se puede eliminar la consulta porque está asociada a un médico.'],
        especialista: especialistaAsociado
      });
    }

    await ConsultaService.deleteConsulta(id);

    return res.status(200).json({
      message: 'Consulta eliminada correctamente.'
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}