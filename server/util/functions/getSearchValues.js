const momentTz = require('moment-timezone');

const getSearchValues = (req) => {
    const page = parseInt(req.query.page) || 1;
    const fechaInicio =
        req.query.fechaInicio
            ? momentTz.tz(req.query.fechaInicio, 'Europe/Madrid')
                .format('YYYY-MM-DD')
            : momentTz.tz()
                .startOf('year')
                .format('YYYY-MM-DD');
    const fechaFin =
        req.query.fechaFin
            ? momentTz.tz(req.query.fechaFin, 'Europe/Madrid')
                .format('YYYY-MM-DD')
            : momentTz.tz()
                .format('YYYY-MM-DD');
    const paciente_id = req.params.id;

    return {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        page: page,
        paciente_id: paciente_id,
    };
}

module.exports = getSearchValues;