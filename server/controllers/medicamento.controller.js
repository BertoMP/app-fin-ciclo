const MedicamentoService = require('../services/medicamento.service');

exports.getMedicamentosPrescripcion = async (req, res) => {
  try {
    const medicamentos = await MedicamentoService.readMedicamentosPrescripcion();

    return res.status(200).json(medicamentos);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.getMedicamentos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;

  try {
    const {
      rows: resultados,
      actualPage: pagina_actual,
      total: cantidad_medicamentos,
      totalPages: paginas_totales
    } =
      await MedicamentoService.readMedicamentos(page, limit);

    if (page > 1 && page > paginas_totales) {
      return res.status(404).json({
        errors: ['La página de medicamentos solicitada no existe.']
      });
    }

    const prev = page > 1
      ? `/medicamento?page=${page - 1}`
      : null;
    const next = page < paginas_totales
      ? `/medicamento?page=${page + 1}`
      : null;
    const result_min = (page - 1) * limit + 1;
    const result_max = resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
    const items_pagina = limit;

    return res.status(200).json({
      prev,
      next,
      pagina_actual,
      paginas_totales,
      cantidad_medicamentos,
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

exports.getMedicamentoById = async (req, res) => {
  const id = parseInt(req.params.medicamento_id);

  try {
    const medicamento = await MedicamentoService.readMedicamentoById(id);

    if (!medicamento) {
      return res.status(404).json({
        errors: ['El medicamento no existe.']
      });
    }

    return res.status(200).json(medicamento);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.createMedicamento = async (req, res) => {
  let descripcion = req.body.descripcion;
  descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

  const medicamento = {
    nombre: req.body.nombre,
    descripcion: descripcion
  }

  try {
    const medicamentoExists =
      await MedicamentoService.readMedicamentoByNombre(medicamento.nombre);

    if (medicamentoExists) {
      return res.status(409).json({
        errors: ['El medicamento ya existe.']
      });
    }

    await MedicamentoService.createMedicamento(medicamento);

    return res.status(200).json({message: 'Medicamento creado.'});
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

exports.updateMedicamento = async (req, res) => {
  const id = parseInt(req.params.medicamento_id);

  let descripcion = req.body.descripcion;
  descripcion = descripcion.replace(/(\r\n|\n|\r)/g, '<br>');

  const medicamento = {
    nombre: req.body.nombre,
    descripcion: descripcion
  }

  try {
    const currentMedicamento =
      await MedicamentoService.readMedicamentoById(id);

    if (!currentMedicamento) {
      return res.status(404).json({
        errors: ['El medicamento no existe.']
      });
    }

    await MedicamentoService.updateMedicamento(id, medicamento);

    return res.status(200).json({message: 'Medicamento actualizado.'});
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}