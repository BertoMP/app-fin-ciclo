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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static('public'));
app.use('/api', require('./routes/api'));

app.listen(SERV_PORT, SERV_HOST, () => {
    console.log(`NodeJS Server listening on http:\\${SERV_HOST}:${SERV_PORT}`);
});
