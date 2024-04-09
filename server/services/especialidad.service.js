const dbConn = require('../util/database');
const EspecialidadModel = require('../models/especialidad.model');

class EspecialidadService {
    static async readEspecialidades(page) {
        return await EspecialidadModel.fetchAll(dbConn, page);
    }

    static async readEspecialidadById(id) {
        return await EspecialidadModel.findById(dbConn, id);
    }

    static async readEspecialidadByNombre(nombre) {
        return await EspecialidadModel.findByNombre(dbConn, nombre);
    }

    static async createEspecialidad(especialidad) {
        return await EspecialidadModel.save(dbConn, especialidad);
    }

    static async deleteEspecialidad(id) {
        return await EspecialidadModel.deleteById(dbConn, id);
    }

    static async updateEspecialidad(id, especialidad) {
        return await EspecialidadModel.updateById(dbConn, id, especialidad);
    }
}

module.exports = EspecialidadService;