// Importación de las librerías necesarias
const mysql2 = require('mysql2');

/**
 * @typedef {Object} DatabaseConfig
 * @property {string} host - El host de la base de datos.
 * @property {string} port - El puerto de la base de datos.
 * @property {string} user - El usuario de la base de datos.
 * @property {string} password - La contraseña de la base de datos.
 * @property {string} database - El nombre de la base de datos.
 * @property {string} timezone - La zona horaria de la base de datos.
 * @memberof Util-Database
 */

/**
 * @type {DatabaseConfig}
 * @memberof Util-Database
 */
const dbConfig = {
  host:       process.env.DB_HOST,
  port:       process.env.DB_PORT,
  user:       process.env.DB_USER,
  password:   process.env.DB_PASS,
  database:   process.env.DB_NAME,
  timezone:   process.env.DB_TIMEZONE,
};

/**
 * Crea un pool de conexiones a la base de datos y lo exporta.
 * @name databasePool
 * @function
 * @memberof Util-Database
 * @returns {Promise} El pool de conexiones a la base de datos.
 */
const databasePool = mysql2.createPool(dbConfig).promise();

module.exports = databasePool;