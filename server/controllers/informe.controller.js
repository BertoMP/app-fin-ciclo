const InformeService = require('../services/informe.service');
const pdfService = require("../services/pdf.service");
const destroyFile = require("../util/functions/destroyFile");

exports.getInforme = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const informe = await InformeService.readInforme(id);

        if (!informe) {
            return res.status(404).json({
                errors: ['Informe no encontrado.']
            });
        }

        return res.status(200).json(informe);
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}

exports.generaInformePDF = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const informe = await InformeService.readInforme(id);

        if (!informe) {
            return res.status(404).json({
                errors: ['Informe no encontrado.']
            });
        }

        const file = await pdfService.generateReceta(informe);

        res.download(file, (err) => {
            if (err) {
                destroyFile(file, true);
                return res.status(500).json({
                    errors: [err.message]
                });
            } else {
                destroyFile(file, true);
            }
        });

    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }

}

exports.createInforme = async (req, res) => {
    try {
        const informe = {
            motivo: req.body.motivo,
            patologia: req.body.patologia,
            contenido: req.body.contenido,
        }

        await InformeService.createInforme(informe);

        return res.status(201).json({
            message: 'Informe creado correctamente.'
        });
    } catch (err) {
        return res.status(500).json({
            errors: [err.message]
        });
    }
}