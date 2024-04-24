const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'public/uploads/images'
        if (req.path.includes('especialidad')) {
            uploadPath += '/especialidad';
        } else if (req.path.includes('especialistas')
            || req.path.includes('registro-especialista')) {
            uploadPath += '/especialistas';
        } else {
            cb(new Error('Invalid path'), null);
            return;
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replaceAll(' ', '_'))
    }
})

const upload = multer({ storage: storage });

module.exports = upload;