// import 3rd party modules
const jwt = require('jsonwebtoken');

// import internal modules
const { JWT_PASSPHRASE, AUTHORITIES } = require('../util/auth.config');
const adiestradorService = require('../services/adiestrador.service');

const decodeToken = (req) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // esperamos la keywod "Bearer " antes del token
    const decodedToken = jwt.verify(token, JWT_PASSPHRASE);
    req.requesterData = {
      userId: decodedToken.userId,
      role: decodedToken.role
    };
    return { userId: decodedToken.userId, role: decodedToken.role };
  } catch (err) {
    err.httpStatus = 401;
    err.message = 'Usuario no autenticado';
    throw err;
  }
};

const isAuthenticated = (req, res, next) => {
  try {
    const { userId, role } = decodeToken(req);
    req.requesterData = { userId: userId, role: role };
    next();
  } catch (err) {
    next(err);
  }
};

const isGod = (req, res, next) => {
  try {
    const { role } = decodeToken(req);
    if (role === AUTHORITIES.GOD) return next();
    else {
      const error = new Error('Usuario no autorizado');
      error.httpStatus = 403;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

const verifyAdiestrador = async (req, res, next) => {
  console.log('idAdiestrador en params: ', req.params.idAdiestrador);
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  console.log('adiestrador:', adiestrador);
  if (!adiestrador._id) {
    const error = new Error('Adiestrador no existe');
    error.httpStatus = 404;
    return next(error);
  }
  try {
    const { userId } = decodeToken(req);
    console.log('token user', userId);
    console.log('adiestrador.userId', adiestrador.userId);
    if (userId === adiestrador.userId) {
      console.log('verified');
      req.adiestrador = adiestrador;
      return next();
    }
    const error = new Error('Usuario no autorizado');
    error.httpStatus = 403;
    next(error);
  } catch (err) {
    next(err);
  }
};

module.exports = { isAuthenticated, isGod, verifyAdiestrador };
