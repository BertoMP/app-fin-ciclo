// Importación de los servicios necesarios
const EspecialidadService = require('../services/especialidad.service');

/**
 * @class EspecialidadController
 * @description Clase estática que implementa la lógica de las especialidades de la aplicación.
 */
class EspecialidadController {
  /**
   * @name getEspecialidades
   * @description Método asíncrono que obtiene especialidades de la base de datos.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
   *              la página actual, el total de páginas, el total de especialidades, el rango de resultados,
   *              y las especialidades.
   *              Si la página solicitada no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof EspecialidadController
   */
  static async getEspecialidades(req, res) {
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

  /**
   * @name getEspecialidadById
   * @description Método asíncrono que obtiene una especialidad específica de la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de la especialidad.
   *              Si la especialidad no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof EspecialidadController
   */
  static async getEspecialidadById(req, res) {
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

  /**
   * @name getEspecialidadesEspecialistas
   * @description Método asíncrono que obtiene las especialidades con especialistas de la base de datos.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de las especialidades.
   *              Si no hay especialidades con especialistas, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof EspecialidadController
   */
  static async getEspecialidadesEspecialistas(req, res) {
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

  /**
   * @name createEspecialidad
   * @description Método asíncrono que crea una nueva especialidad en la base de datos.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
   *              Si la especialidad ya existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof EspecialidadController
   */
  static async createEspecialidad(req, res) {
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

  /**
   * @name updateEspecialidad
   * @description Método asíncrono que actualiza una especialidad existente en la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
   *              Si la especialidad no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof EspecialidadController
   */
  static async updateEspecialidad(req, res) {
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

  /**
   * @name deleteEspecialidad
   * @description Método asíncrono que elimina una especialidad específica de la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
   *              Si la especialidad no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof EspecialidadController
   */
  static async deleteEspecialidad(req, res) {
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
}

// Exportación del controlador
module.exports = EspecialidadController;