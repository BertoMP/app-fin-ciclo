// Importación de las librerías necesarias
import { createPool } from 'mysql2';

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

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
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	timezone: process.env.DB_TIMEZONE,
};

/**
 * Crea un pool de conexiones a la base de datos y lo exporta.
 * @name dbConn
 * @function
 * @memberof Util-Database
 * @returns {Promise} El pool de conexiones a la base de datos.
 */
export const dbConn = createPool(dbConfig).promise();
