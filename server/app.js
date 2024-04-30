// Cargamos las variables de entorno
require('dotenv').config();

// Importamos las dependencias necesarias
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.js');
const express = require('express');
const cors = require('cors');

// Configuramos las opciones de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: process.env.CORS_METHODS,
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS
};

// Definimos las variables de entorno para el host y el puerto del servidor
const SERV_HOST = process.env.SERV_HOST;
const SERV_PORT = process.env.SERV_PORT;

// Creamos la aplicación Express
const app = express();

// Configuramos el middleware de Express para analizar el cuerpo de las solicitudes
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Aplicamos las opciones de CORS a nuestra aplicación Express
app.use(cors(corsOptions));

// Configuramos Swagger UI para servir la documentación de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Importamos y usamos nuestras rutas de API
app.use('/api', require('./routes/api'));

// Iniciamos el servidor
app.listen(SERV_PORT, SERV_HOST, () => {
  console.log(`NodeJS Server listening on http:\\${SERV_HOST}:${SERV_PORT}`);
});
