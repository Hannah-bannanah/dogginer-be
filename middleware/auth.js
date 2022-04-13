// import 3rd party modules
const jwt = require('jsonwebtoken');
const { JWT_PASSPHRASE } = require('../util/auth.config');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // esperamos la keywod "Bearer " antes del token
    jwt.verify(token, JWT_PASSPHRASE);
    next();
  } catch (err) {
    err.httpStatus = 401;
    err.message = 'Usuario no autenticado';
    next(err);
  }
};

module.exports = { isAuthenticated };
