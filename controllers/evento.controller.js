// import 3rd party modules

// import internal modules
const { decodeToken } = require('../middleware/auth');
const eventoService = require('../services/evento.service');
const { AUTHORITIES } = require('../util/auth.config');
const { HttpError } = require('../util/error.class');

exports.findAll = async (req, res, next) => {
  let eventos = [];

  // comprobamos si hemos recibido token
  try {
    const { userId, role } = decodeToken(req);
    if (role === AUTHORITIES.GOD) eventos = await eventoService.findAll();
    else eventos = await eventoService.findAccessible(userId, role);
  } catch (err) {
    // si no hay token, devolvemos solo los eventos publicos
    eventos = await eventoService.findPublic();
  }
  res.status(200).send(eventos);
};

exports.findById = async (req, res, next) => {
  let userData = null;
  // comprobamos si hemos recibido token
  try {
    userData = decodeToken(req);
  } catch (err) {
    // ignoramos el error, ya que userData es opcional
  }
  try {
    const evento = await eventoService.findById(req.params.idEvento, userData);
    res.status(200).send(evento);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const evento = await eventoService.create({ ...req.body, imageUrl: req.body.imageUrl || undefined });
    res.status(200).send({ id: evento._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const result = await eventoService.deleteById(req.params.idEvento);
    if (result) res.status(204).send();
    else throw new HttpError('Error al cancelar el evento', 500);
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
