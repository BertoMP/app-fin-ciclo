const TomaModel = require('../models/toma.model');
const dbConn = require('../util/database/database');

class TomaService {
  static async createToma(prescripcion, conn = dbConn) {
    try {
      return await TomaModel.createToma(prescripcion, conn);
    } catch (error) {
      throw new Error('Error al guardar la toma.');
    }
  }

  static async deleteToma(id, conn = dbConn) {
    try {
      await TomaModel.deleteToma(id, conn);
    } catch (error) {
      throw new Error('Error al eliminar la toma.');
    }
  }
}

module.exports = TomaService;