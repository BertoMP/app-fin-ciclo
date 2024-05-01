// Importación de los servicios necesarios
const PacienteService = require('../services/paciente.service');

/**
 * @name getPacientes
 * @description Método asíncrono que obtiene todos los pacientes de la base de datos.
 *              Devuelve un objeto JSON con la respuesta HTTP que incluye los datos de los pacientes.
 *              Si no se encuentran pacientes, devuelve un error con el mensaje correspondiente.
 * @async
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Object} res - El objeto de respuesta de Express.
 * @throws {Error} Si ocurre algún error durante el proceso, captura el error y devuelve un error 500 con un mensaje de error.
 * @memberof Controllers-Paciente
 */
exports.getPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteService.readPacientes();

    if (!pacientes) {
      return res.status(404).json({
        errors: ['No se encontraron pacientes']
      });
    }

    return res.status(200).json({
      pacientes
    });
  } catch (err) {
    return res.status(500).json({
      errors: [err.message]
    });
  }
}