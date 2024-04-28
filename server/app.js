const express = require('express');
const cors = require('cors');

require('dotenv').config();

const SERV_HOST = process.env.SERV_HOST;
const SERV_PORT = process.env.SERV_PORT;

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: process.env.CORS_METHODS,
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS
};

app.use(cors(corsOptions));

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.js');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use('/api', require('./routes/api'));

app.listen(SERV_PORT, SERV_HOST, () => {
  console.log(`NodeJS Server listening on http:\\${SERV_HOST}:${SERV_PORT}`);
});
