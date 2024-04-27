const CitaService = require('../services/cita.service');
const UsuarioService = require('../services/usuario.service');
const EspecialistaService = require('../services/especialista.service');
const PdfService = require("../services/pdf.service");
const EmailService = require("../services/email.service");

const getSearchValues = require('../util/functions/getSearchValuesByDate');
const destroyFile = require("../util/functions/destroyFile");
const qrcode = require("../util/functions/createQr");

exports.getCitas = async (req, res) => {
    const limit = 10;

    try {
        const searchValues = getSearchValues(req, true);

        const page = searchValues.page;
        const fechaInicio = searchValues.fechaInicio;
        const fechaFin = searchValues.fechaFin;
        const paciente_id = searchValues.paciente_id;

        const {
            rows: resultados,
            actualPage: pagina_actual,
            total: cantidad_citas,
            totalPages: paginas_totales
        } =
            await CitaService.readCitas(searchValues, limit);

        if (page > 1 && page > paginas_totales) {
            return res.status(404).json({
                errors: ['La página de citas solicitada no existe.']
            });
        }

        const prev = page > 1
            ? `/cita/${paciente_id}?page=${page - 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
            : null;
        const next = page < paginas_totales
            ? `/cita/${paciente_id}?page=${page + 1}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
            : null;
        const result_min = (page - 1) * limit + 1;
        const result_max = resultados[0].citas.length === limit
            ? page * limit
            : (page - 1) * limit + resultados[0].citas.length;
        const fecha_inicio = fechaInicio;
        const fecha_fin = fechaFin;
        const items_pagina = limit;

        return res.status(200).json({
            prev,
            next,
            pagina_actual,
            paginas_totales,
            cantidad_citas,
            result_min,
            result_max,
            items_pagina,
            fecha_inicio,
            fecha_fin,
            resultados
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.getCitasAgenda = async (req, res) => {
    const especialista_id = req.user_id;

    try {
        const citas = await CitaService.readCitasAgenda(especialista_id);

        return res.status(200).json(citas);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.createCita = async (req, res) => {
    const cita = {
        paciente_id: req.user_id,
        especialista_id: req.body.especialista_id,
        fecha: req.body.fecha,
        hora: req.body.hora,
    }

    let pdf;
    let idCita;

    try {
        const citaExists = await CitaService.readCitaByData(cita);

        if (citaExists) {
            return res.status(404).json({
                errors: ['La cita que intenta crear no esta disponible.']
            });
        }

        const especialista =
            await EspecialistaService.readEspecialistaByEspecialistaId(cita.especialista_id);

        if (!especialista) {
            return res.status(404).json({
                errors: ['El especialista seleccionado no existe.']
            });
        }

        const citaHora = new Date(`1970-01-01T${cita.hora}Z`);

        const diurnoInicio = new Date('1970-01-01T08:00:00Z');
        const diurnoFin = new Date('1970-01-01T14:00:00Z');

        const vespertinoInicio = new Date('1970-01-01T14:30:00Z');
        const vespertinoFin = new Date('1970-01-01T20:00:00Z');

        if (especialista.turno === 'no-trabajando'
            || especialista.turno === 'diurno'
            && (citaHora < diurnoInicio
                || citaHora > diurnoFin)
            || especialista.turno === 'vespertino'
            && (citaHora < vespertinoInicio
                || citaHora > vespertinoFin)) {
            return res.status(404).json({
                errors: ['El especialista no trabaja en el horario seleccionado.']
            });
        }

        idCita = await CitaService.createCita(cita);

        const newCita = await CitaService.readCitaById(idCita);

        const qr = await qrcode.generateQRCode(newCita);

        pdf = await PdfService.generateCitaPDF(newCita, qr);

        const emailPaciente = await UsuarioService.getEmailById(cita.paciente_id);

        await EmailService.sendPdfCita(newCita, emailPaciente, pdf);

        destroyFile(pdf, true);

        return res.status(201).json({
            message: 'Cita creada correctamente.'
        });

    } catch (err) {
        if (pdf) {
            destroyFile(pdf, true);
        }

        if (idCita) {
            await CitaService.deleteCita(idCita);
        }

        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.deleteCita = async (req, res) => {
    const citaId = req.params.cita_id;
    const userId = req.user_id;

    try {
        const cita = await CitaService.readCitaById(citaId);

        if (!cita) {
            return res.status(404).json({
                errors: ['La cita que intenta eliminar no existe.']
            });
        }

        if (cita.datos_paciente.paciente_id !== userId) {
            return res.status(403).json({
                errors: ['No tienes permiso para eliminar esta cita.']
            });
        }

        await CitaService.deleteCita(citaId);

        return res.status(200).json({
            message: 'Cita eliminada correctamente.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}