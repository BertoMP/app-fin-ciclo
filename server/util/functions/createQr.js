const QRCode = require('qrcode');

async function generateQRCode(cita) {
    try {
        const citaString = JSON.stringify(cita);
        return await QRCode.toDataURL(citaString);
    } catch (err) {
        throw new Error('Error al generar el código QR.');
    }
}

module.exports = { generateQRCode };