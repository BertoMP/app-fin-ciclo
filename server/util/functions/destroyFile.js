const fs = require('fs');
const path = require('path');

const destroyFile = (filePath, absolute = false) => {
    let absolutePath = filePath;

    if (!absolute) {
        absolutePath = path.join(__dirname, '..', '..', filePath);
    }

    if (fs.existsSync(absolutePath)) {
        fs.unlink(absolutePath, unlinkError => {
            if (unlinkError) {
                throw new Error(`Error al eliminar el archivo subido: ${unlinkError}`);
            }
        });
    } else {
        throw new Error(`El archivo no existe en: ${absolutePath}`);
    }
}

module.exports = destroyFile;