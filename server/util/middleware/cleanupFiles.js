const destroyFile = require('../functions/destroyFile');

exports.cleanupFiles = (req, res, next) => {
  if (req.validationErrors) {
    if (req.file && req.file.path) {
      destroyFile(req.file.path);
    }
    return res.status(409).json({errors: req.validationErrors});
  }
  next();
};