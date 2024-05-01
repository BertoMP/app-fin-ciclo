// Importación de los servicios necesarios
const EspecialistaService = require('../services/especialista.service');

/**
 * @class EspecialistaController
 * @description Clase estática que implementa la lógica de los especialistas de la aplicación.
 */
class EspecialistaController {
  /**
   * @name getEspecialistaById
   * @description Método asíncrono que obtiene un especialista específico de la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del especialista.
   *              Si el especialista no existe o no está trabajando, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof EspecialistaController
   */
  static async getEspecialistaById(req, res) {
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
}

// Exportación del controlador
module.exports = EspecialistaController;