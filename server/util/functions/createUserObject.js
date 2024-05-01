/**
 * @name createUserObject
 * @description Crea un objeto de usuario a partir de los datos de la solicitud, la contraseña encriptada y el ID del rol.
 * @function
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {string} encryptedPassword - La contraseña encriptada del usuario.
 * @param {number} rol_id - El ID del rol del usuario.
 * @returns {Object} Un objeto que representa al usuario.
 * @memberof Util-Functions
 */
const createUserObject = (req, encryptedPassword, rol_id) => {
  return {
    email: req.body.email,
    password: encryptedPassword,
    nombre: req.body.nombre,
    primer_apellido: req.body.primer_apellido,
    segundo_apellido: req.body.segundo_apellido,
    dni: req.body.dni,
    rol_id: rol_id
  };
}

module.exports = createUserObject;