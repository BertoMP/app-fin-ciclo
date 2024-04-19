const CitaService = require('../services/cita.service');
const UsuarioService = require('../services/usuario.service');
const pdfService = require("../services/pdf.service");
const emailService = require("../services/email.service");

const destroyFile = require("../util/functions/destroyFile");
const qrcode = require("../util/functions/createQr");

exports.getCitas = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const paciente_id = req.params.id;

    try {
        const {
            rows: resultados,
            actualPage: pagina_actual,
            total: cantidad_citas,
            totalPages: paginas_totales
        } =
            await CitaService.readCitas(page, paciente_id);

        if (page > 1 && page > paginas_totales) {
            return res.status(404).json({
                errors: ['La página de citas solicitada no existe.']
            });
        }

        const prev = page > 1
            ? `/api/cita?page=${page - 1}`
            : null;
        const next = page < paginas_totales
            ? `/api/cita?page=${page + 1}`
            : null;
        const result_min = (page - 1) * 10 + 1;
        const result_max = resultados.length === 10 ? page * 10 : (page - 1) * 10 + resultados.length;

        return res.status(200).json({
            prev,
            next,
            pagina_actual,
            paginas_totales,
            cantidad_citas,
            result_min,
            result_max,
            resultados
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.getCitasAgenda = async (req, res) => {
    const especialista_id = req.params.id;

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
        paciente_id: req.body.paciente_id,
        especialista_id: req.body.especialista_id,
        fecha: req.body.fecha,
        hora: req.body.hora,
    }

    let pdf;
    let newCita;

    try {
        const citaExists = await CitaService.readCitaByData(cita);

        if (citaExists) {
            return res.status(404).json({
                errors: ['La cita que intenta crear ya existe.']
            });
        }

        const idCita = await CitaService.createCita(cita);

        newCita = await CitaService.readCitaById(idCita);
        const qr = await qrcode.generateQRCode(newCita);

        pdf = await pdfService.generateCitaPDF(newCita, qr);

        const emailPaciente = await UsuarioService.getEmailById(cita.paciente_id);

        await emailService.sendPdfCita(newCita, emailPaciente, pdf);

        destroyFile(pdf);

        return res.status(201).json({
            message: 'Cita creada correctamente.'
        });

    } catch (err) {
        if (pdf) {
            destroyFile(pdf);
        }

        if (newCita) {
            await CitaService.deleteCita(newCita.id);
        }

        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.deleteCita = async (req, res) => {
    const id = req.params.id;

    try {
        const cita = await CitaService.readCitaById(id);

        if (!cita) {
            return res.status(404).json({
                errors: ['La cita que intenta eliminar no existe.']
            });
        }

        await CitaService.deleteCita(id);

        return res.status(200).json({
            message: 'Cita eliminada correctamente.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}