// Importación de los servicios necesarios
const EspecialistaService = require('../services/especialista.service');

/**
 * @name getEspecialistaById
 * @description Método asíncrono que obtiene un especialista específico de la base de datos utilizando su ID.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del especialista.
 *              Si el especialista no existe o no está trabajando, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Especialista
 */
exports.getEspecialistaById = async (req, res) => {
  const id = parseInt(req.params.usuario_id);

  try {
    const especialista = await EspecialistaService.readEspecialistaById(id);

    if (!especialista || especialista.turno === 'no-trabajando') {
      return res.status(404).json({
        errors: ['Especialista no encontrado.']
      });
    }

    return res.status(200).json(especialista);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}