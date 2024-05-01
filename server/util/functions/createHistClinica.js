/**
 * @name createHistClinica
 * @description Método que crea un número de historia clínica único.
 * @function
 * @returns {string} El número de historia clínica.
 * @memberof Util-Functions
 */
function createHistClinica() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${random}`;
}

module.exports = createHistClinica;