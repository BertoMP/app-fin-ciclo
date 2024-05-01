// Importación de los servicios necesarios
const ConsultaService       = require('../services/consulta.service');
const EspecialistaService   = require('../services/especialista.service');

/**
 * @class ConsultaController
 * @description Clase estática que implementa la lógica de las consultas de la aplicación.
 */
class ConsultaController {
  /**
   * @name getConsultas
   * @description Método asíncrono que obtiene consultas de la base de datos.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
   *              la página actual, el total de páginas, el total de consultas, el rango de resultados,
   *              y las consultas.
   *              Si la página solicitada no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof ConsultaController
   */
  static async getConsultas(req, res) {
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

  /**
   * @name getConsultaById
   * @description Método asíncrono que obtiene una consulta específica de la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de la consulta.
   *              Si la consulta no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof ConsultaController
   */
  static async getConsultaById(req, res) {
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

  /**
   * @name createConsulta
   * @description Método asíncrono que crea una nueva consulta en la base de datos.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
   *              Si la consulta ya existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof ConsultaController
   */
  static async createConsulta(req, res) {
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

  /**
   * @name updateConsulta
   * @description Método asíncrono que actualiza una consulta existente en la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
   *              Si la consulta no existe o ya existe una consulta con el mismo nombre, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof ConsultaController
   */
  static async updateConsulta(req, res) {
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

  /**
   * @name deleteConsulta
   * @description Método asíncrono que elimina una consulta específica de la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
   *              Si la consulta no existe o está asociada a un médico, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof ConsultaController
   */
  static async deleteConsulta(req, res) {
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
}

// Exportación del controlador
module.exports = ConsultaController;