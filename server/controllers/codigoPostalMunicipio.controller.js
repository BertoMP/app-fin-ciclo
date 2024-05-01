// Importación de los servicios necesarios
const CodigoPostalMunicipioService  = require('../services/codigoPostalMunicipio.service');

/**
 * @class CodigoPostalMunicipioController
 * @description Clase estática que implementa la lógica de los códigos postales de los municipios de la aplicación.
 */
class CodigoPostalMunicipioController {
  /**
   * @name getCodigoPostal
   * @description Método asíncrono que obtiene el código postal de un municipio específico de la base de datos utilizando su ID.
   *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del código postal.
   *              Si el código postal no existe, devuelve un error con el mensaje correspondiente.
   * @static
   * @async
   * @function
   * @param {Object} req - El objeto de solicitud de Express.
   * @param {Object} res - El objeto de respuesta de Express.
   * @returns {Object} res - El objeto de respuesta de Express.
   * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
   * @memberof CodigoPostalMunicipioController
   */
  static async getCodigoPostal(req, res) {
    try {
      const cod_municipio = req.params.municipio_id;

      const codigoPostal =
        await CodigoPostalMunicipioService.readCodigoPostalByMunicipioId(cod_municipio);

      if (!codigoPostal || codigoPostal.length === 0) {
        return res.status(404).json({
          errors: ['No se ha encontrado el código postal.']
        });
      }

      return res.status(200).json(codigoPostal);
    } catch (err) {
      return res.status(500).json({
        errors: [err.message]
      });
    }
  }
}

// Exportación del módulo
module.exports = CodigoPostalMunicipioController;