// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

// Definición de las variables de entorno
const SERV_HOST = process.env.SERV_HOST;
const SERV_PORT = process.env.SERV_PORT;

// Importación las dependencias necesarias
import { serve, setup } from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.js';
import express, { json, urlencoded, static as expressStatic } from 'express';
import cors from 'cors';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import apiRoutes from './routes/api.js';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import path from 'path';
import { generateLogFileName } from './util/functions/logger.js';

// Definición de las variables __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de las opciones de CORS
const corsOptions = {
	origin: process.env.CORS_ORIGIN,
	methods: process.env.CORS_METHODS,
	allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
};

// Crear un stream rotativo para registrar las solicitudes HTTP
const accessLogStream = rfs.createStream(generateLogFileName, {
	interval: '1d',
	path: path.join(__dirname, 'logs'),
});

// Creación la aplicación Express
export const app = express();

// Configuración del middleware de Express para analizar el cuerpo de las solicitudes
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

// Configurar morgan para usar el stream rotativo que registra las solicitudes HTTP
app.use(morgan('combined', { stream: accessLogStream }));

// Configuración de Swagger UI para servir la documentación de la API
app.use('/api-docs', serve, setup(swaggerDocument));

// Configuración para servir los archivos estáticos desde el directorio 'jsdocs'
app.use('/docs', expressStatic(join(__dirname, 'docs', 'jsdocs')));

// Importación de las rutas de la API
app.use('/api', cors(corsOptions), apiRoutes);

// Inicialización del servidor
const server = app.listen(SERV_PORT, SERV_HOST, () => {
	console.log(`NodeJS Server listening on http:\\${SERV_HOST}:${SERV_PORT}`);
});

// Exportación de la aplicación Express
export default {
	app,
	server,
};
