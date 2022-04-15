// import 3rd party modules
const jwt = require('jsonwebtoken');

// import internal modules
const { JWT_PASSPHRASE, AUTHORITIES } = require('../util/auth.config');
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const userService = require('../services/user.service');

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
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (!adiestrador._id) {
    const error = new Error('Adiestrador no existe');
    error.httpStatus = 404;
    return next(error);
  }
  try {
    const { userId } = decodeToken(req);
    const user = await userService.findById(userId);

    if (user._id.equals(adiestrador.userId)) {
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

const verifyCliente = async (req, res, next) => {
  const cliente = await clienteService.findById(req.params.idCliente);
  if (!cliente._id) {
    const error = new Error('Cliente no existe');
    error.httpStatus = 404;
    return next(error);
  }
  try {
    const { userId } = decodeToken(req);
    const user = await userService.findById(userId);

    if (user._id.equals(cliente.userId)) {
      req.cliente = cliente;
      return next();
    }
    const error = new Error('Usuario no autorizado');
    error.httpStatus = 403;
    next(error);
  } catch (err) {
    next(err);
  }
};

module.exports = { isAuthenticated, isGod, verifyAdiestrador, verifyCliente };
