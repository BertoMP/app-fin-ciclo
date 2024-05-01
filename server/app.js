// Carga de las variables de entorno
require('dotenv').config();

// Definición de las variables de entorno
const SERV_HOST           = process.env.SERV_HOST;
const SERV_PORT           = process.env.SERV_PORT;

// Importación las dependencias necesarias
const swaggerUi           = require('swagger-ui-express');
const swaggerDocument     = require('./docs/swagger.js');
const express             = require('express');
const cors                = require('cors');
const path                = require('path');

// Configuración de las opciones de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: process.env.CORS_METHODS,
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS
};

// Creación la aplicación Express
const app = express();

// Configuración del middleware de Express para analizar el cuerpo de las solicitudes
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Aplicación de las opciones de CORS
app.use(cors(corsOptions));

// Configuración de Swagger UI para servir la documentación de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Configuración para servir los archivos estáticos desde el directorio 'jsdocs'
app.use('/docs', express.static(path.join(__dirname, 'docs', 'jsdocs')));

// Importación de las rutas de la API
app.use('/api', require('./routes/api'));

// Inicialización del servidor
app.listen(SERV_PORT, SERV_HOST, () => {
  console.log(`NodeJS Server listening on http:\\${SERV_HOST}:${SERV_PORT}`);
});
