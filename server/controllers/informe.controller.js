// Importación de los servicios necesarios
const InformeService  = require('../services/informe.service');
const CitaService     = require('../services/cita.service');
const PdfService      = require("../services/pdf.service");

/**
 * @name getInforme
 * @description Método asíncrono que obtiene un informe específico de la base de datos utilizando su ID.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del informe.
 *              Si el informe no existe, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Informe
 */
exports.getInforme = async (req, res) => {
  const user_role = req.user_role;
  const informe_id = parseInt(req.params.informe_id);

  try {
    const informe = await fetchInforme(user_role, informe_id, req, res);

    if (!informe) {
      return res.status(404).json({
        errors: ['Informe no encontrado.']
      });
    }

    return res.status(200).json(informe);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

/**
 * @name generaInformePDF
 * @description Método asíncrono que genera un informe en formato PDF.
 *              Devuelve el archivo PDF para su descarga.
 *              Si el informe no existe, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Informe
 */
exports.generaInformePDF = async (req, res) => {
  const user_role = req.user_role;
  const informe_id = parseInt(req.params.informe_id);

  try {
    const informe = await fetchInforme(user_role, informe_id, req, res);

    if (!informe) {
      return res.status(404).json({
        errors: ['Informe no encontrado.']
      });
    }

    const file = await PdfService.generateInforme(informe);

    res.status(200).download(file, async (err) => {
      await PdfService.destroyPDF(file);
      if (err) {
        console.error('Error al descargar el archivo:', err);
      }
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

/**
 * @name createInforme
 * @description Método asíncrono que crea un nuevo informe en la base de datos.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye un mensaje de éxito.
 *              Si ocurre algún error durante la creación del informe, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Informe
 */
exports.createInforme = async (req, res) => {
  try {
    let contenido = req.body.contenido;
    contenido = contenido.replace(/(\r\n|\n|\r)/g, '<br>');

    const informe = {
      motivo: req.body.motivo,
      patologias: req.body.patologias,
      contenido: contenido,
      cita_id: req.body.cita_id
    }

    await InformeService.createInforme(informe);

    return res.status(200).json({
      message: 'Informe creado correctamente.'
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}

/**
 * @name fetchInforme
 * @description Método asíncrono que obtiene un informe específico de la base de datos utilizando su ID.
 *              Devuelve el informe si el usuario tiene permiso para acceder a él.
 *              Si el informe no existe o el usuario no tiene permiso para acceder a él, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {number} user_role - El rol del usuario que realiza la solicitud.
 * @param {number} informe_id - El ID del informe que se desea obtener.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express, o el informe si el usuario tiene permiso para acceder a él.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Informe
 */
async function fetchInforme(user_role, informe_id, req, res) {
  const pacienteId = await CitaService.readPacienteIdByInformeId(informe_id);

  if (!pacienteId) {
    return res.status(404).json({
      errors: ['Informe no encontrado.']
    });
  }

  if (user_role === 2 && pacienteId !== req.user_id) {
    return res.status(403).json({
      errors: ['No tienes permiso para realizar esta acción.']
    });
  }

  return await InformeService.readInforme(informe_id);
}