// import 3rd party modules

// import internal modules
const { decodeToken } = require('../middleware/auth');
const eventoService = require('../services/evento.service');

exports.findAll = async (req, res, next) => {
  let eventos = [];

  // comprobamos si hemos recibido token
  try {
    const { userId, role } = decodeToken(req);
    eventos = await eventoService.findAccessible(userId, role);
  } catch (err) {
    // si no hay token, devolvemos solo los eventos publicos
    eventos = await eventoService.findPublic();
  }
  res.status(200).send(eventos);
};

exports.findById = async (req, res, next) => {
  try {
    const evento = await eventoService.findById(req.params.idEvento);
    res.status(200).send(evento);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const evento = await eventoService.create(req.body);
    res.status(200).send({ id: evento._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const result = await eventoService.deleteById(req.params.idEvento);
    if (result) res.status(204).send();
    else throw new Error();
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const eventoActualizado = await eventoService.update(
      req.params.idEvento,
      req.body
    );
    res.status(200).send(eventoActualizado);
  } catch (err) {
    next(err);
  }
};
