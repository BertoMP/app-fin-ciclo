const { check } = require("express-validator");

exports.validateImage = check('file')
    .custom((value, { req }) => {
        if (!req.file) {
            throw new Error('La imagen es requerida');
        }

        const filename = req.file.originalname;

        if (!filename.endsWith('.jpg')
            && !filename.endsWith('.jpeg')
            && !filename.endsWith('.png')) {
            throw new Error('La imagen debe ser de tipo jpg, jpeg o png');
        }

        return true;
    });