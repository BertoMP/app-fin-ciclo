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
                console.log(`Error al eliminar el archivo subido: ${unlinkError}`);
            }
        });
    } else {
        console.log(`El archivo no existe en: ${absolutePath}`);
    }
}

module.exports = destroyFile;