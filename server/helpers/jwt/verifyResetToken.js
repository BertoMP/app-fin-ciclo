// Importación de las librerías necesarias
import pkg from 'jsonwebtoken';
const { verify } = pkg;

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

export const verifyResetToken = (req, res) => {
	const resetToken = req.body.token;

	return new Promise((resolve) => {
		verify(resetToken, process.env.JWT_RESET_SECRET_KEY, (err, decodedToken) => {
			if (err || !decodedToken) {
				if (err.name === 'TokenExpiredError') {
					return res.status(401).json({
						errors: ['El token ha expirado. Solicita un nuevo enlace.'],
					});
				} else {
					return res.status(401).json({
						errors: ['Token inválido o expirado.'],
					});
				}
			}

			resolve(decodedToken.email);
		});
	});
};
