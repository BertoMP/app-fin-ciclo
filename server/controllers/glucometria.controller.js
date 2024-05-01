// Importación de los servicios necesarios
const GlucometriaService  = require('../services/glucometria.service');
const PacienteService     = require('../services/paciente.service');

// Importación de librerías
const momentTz            = require('moment-timezone');

// Importación de funciones
const getSearchValues     = require('../util/functions/getSearchValuesByDate');

/**
 * @class GlucometriaController
 * @description Clase estática que implementa la lógica de las glucometrías de la aplicación.
 */
class GlucometriaController {
  /**
   * @name getGlucometria
   * @description Método asíncrono que obtiene glucometrías de la base de datos.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye las URL de las páginas anterior y siguiente,
   *              la página actual, el total de páginas, el total de glucometrías, el rango de resultados,
   *              la fecha de inicio, la fecha de fin, los elementos por página y las glucometrías.
   *              Si la página solicitada no existe o el paciente no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof GlucometriaController
   */
  static async getGlucometria(req, res) {
    const limit = 10;

    try {
      const searchValues = getSearchValues(req);

      const page = searchValues.page;
      const fechaInicio = searchValues.fechaInicio;
      const fechaFin = searchValues.fechaFin;
      const paciente_id = searchValues.paciente_id;

      const pacienteExists = await PacienteService.readPacienteByUserId(paciente_id);

      if (!pacienteExists) {
        return res.status(404).json({
          errors: ['El paciente no existe.']
        });
      }

      const {
        rows: resultados,
        total: cantidad_glucometrias,
        actualPage: pagina_actual,
        totalPages: paginas_totales
      } =
        await GlucometriaService.readGlucometria(searchValues, limit);

      if (page > 1 && page > paginas_totales) {
        return res.status(404).json({
          errors: ['La página de glucometrías solicitada no existe.']
        });
      }

      const prev = page > 1
        ? `/glucometria/${paciente_id}?page=${page - 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
        : null;
      const next = page < paginas_totales
        ? `/glucometria/${paciente_id}?page=${page + 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
        : null;
      const result_min = (page - 1) * limit + 1;
      const result_max = resultados.length === limit ? page * limit : (page - 1) * limit + resultados.length;
      const fecha_inicio = fechaInicio;
      const fecha_fin = fechaFin;
      const items_pagina = limit;

      return res.status(200).json({
        prev,
        next,
        pagina_actual,
        paginas_totales,
        cantidad_glucometrias,
        result_min,
        result_max,
        items_pagina,
        fecha_inicio,
        fecha_fin,
        resultados
      });
    } catch (error) {
      return res.status(500).json({
        errors: [error.message]
      });
    }
  }

  /**
   * @name postGlucometria
   * @description Método asíncrono que crea una nueva glucometría en la base de datos.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
   *              Si ocurre algún error durante la creación de la glucometría, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof GlucometriaController
   */
  static async postGlucometria(req, res) {
    const fecha = momentTz.tz(new Date(), 'Europe/Madrid')
      .format('YYYY-MM-DD');
    const hora = momentTz.tz(new Date(), 'Europe/Madrid')
      .format('HH:mm:ss');
    const medicion = req.body.medicion;
    const paciente_id = req.user_id;

    const glucometria = {
      paciente_id: paciente_id,
      fecha: fecha,
      hora: hora,
      medicion: medicion,
    }

    try {
      await GlucometriaService.createGlucometria(glucometria);

      return res.status(200).json({message: 'Glucometría creada exitosamente.'});
    } catch (err) {
      return res.status(500).json({
        errors: ['Error al crear la glucometría.'],
      });
    }
  }
}

// Exportación del controlador
module.exports = GlucometriaController;