const momentTz = require('moment-timezone');

const getSearchValuesByDate = (req, possibleFutureDates = false) => {
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
      : possibleFutureDates
        ? momentTz.tz()
          .add(3, 'year')
          .format('YYYY-MM-DD')
        : momentTz.tz()
          .format('YYYY-MM-DD');

  let paciente_id = 0;

  if (req.user_role === 2) {
    paciente_id = req.user_id;
  } else if (req.user_role === 3) {
    paciente_id = req.params.usuario_id;
  }

  return {
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    page: page,
    paciente_id: paciente_id
  };
}

module.exports = getSearchValuesByDate;