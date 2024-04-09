const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('public'));
app.use('/api', require('./routes/api'));

const SERV_HOST = process.env.SERV_HOST || 'localhost';
const SERV_PORT = process.env.SERV_PORT || 3000;
app.listen(SERV_PORT, SERV_HOST, () => {
    console.log(`NodeJS Server listening on http:\\${SERV_HOST}:${SERV_PORT}`);
});
