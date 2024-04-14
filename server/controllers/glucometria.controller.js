const glucometriaService = require('../services/glucometria.service');
const momentTz = require('moment-timezone');
const getSearchValues = require('../util/functions/getSearchValues');

exports.getGlucometria = async (req, res) => {
    try {
        const searchValues = getSearchValues(req);

        const page = searchValues.page;
        const fechaInicio = searchValues.fechaInicio;
        const fechaFin = searchValues.fechaFin;
        const paciente_id = searchValues.paciente_id;

        const {
            rows: resultados,
            total: cantidad_glucometrias,
            actualPage: pagina_actual,
            totalPages: paginas_totales
        } =
            await glucometriaService.readGlucometria(searchValues);

        if (page > 1 && page > paginas_totales) {
            return res.status(404).json({
                errors: ['La página de glucometrías solicitada no existe.']
            });
        }

        const prev = page > 1
            ? `/api/glucometria/${paciente_id}?page=${page - 1}`
            : null;
        const next = page < paginas_totales
            ? `/api/glucometria/${paciente_id}?page=${page + 1}`
            : null;
        const result_min = (page - 1) * 10 + 1;
        const result_max = resultados.length === 10 ? page * 10 : (page - 1) * 10 + resultados.length;
        const fecha_inicio = fechaInicio;
        const fecha_fin = fechaFin;

        resultados.forEach(glucometria => {
            glucometria.fecha = momentTz.tz(glucometria.fecha, 'Europe/Madrid')
                .format('YYYY-MM-DD');
        });

        return res.status(200).json({
            prev,
            next,
            pagina_actual,
            paginas_totales,
            cantidad_glucometrias,
            result_min,
            result_max,
            fecha_inicio,
            fecha_fin,
            resultados
        });
    } catch (error) {
        return res.status(500).json({
            errors: [error.message]
        });
    }
}

exports.postGlucometria = async (req, res) => {
    const fecha = momentTz.tz(new Date(), 'Europe/Madrid')
        .format('YYYY-MM-DD');
    const hora = momentTz.tz(new Date(), 'Europe/Madrid')
        .format('HH:mm:ss');
    const medicion = req.body.medicion;
    const paciente_id = req.body.user_id;

    const glucometria = {
        paciente_id: paciente_id,
        fecha: fecha,
        hora: hora,
        medicion: medicion,
    }

    try {
        await glucometriaService.createGlucometria(glucometria);

        return res.status(201).json({ message: 'Glucometría creada exitosamente.'});
    } catch (err) {
        return res.status(500).json({
            errors: ['Error al crear la glucometría.'],
        });
    }
}