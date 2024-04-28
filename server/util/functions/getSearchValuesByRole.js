const getSearchValuesByRole = (req) => {
  const page = parseInt(req.query.page) || 1;
  const role_id = req.query.role || 0;

  return {
    page: page,
    role: role_id
  };
}

module.exports = getSearchValuesByRole;