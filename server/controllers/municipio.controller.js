// Importación de los servicios necesarios
const MunicipioService = require('../services/municipio.service');

/**
 * @name getMunicipio
 * @description Método asíncrono que obtiene un municipio específico de la base de datos utilizando el ID de su provincia.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos del municipio.
 *              Si el municipio no existe, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Municipio
 */
exports.getMunicipio = async (req, res) => {
  const provinciaId = req.params.provincia_id;

  try {
    const municipio = await MunicipioService.readMunicipioByProvinciaId(provinciaId);

    if (!municipio) {
      return res.status(404).json({
        errors: ['El municipio no fue encontrado.']
      });
    }

    return res.status(200).json(municipio);
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}