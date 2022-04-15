// import 3rd party modules

// import internal modules
const eventoService = require('../services/evento.service');

exports.findAll = async (req, res, next) => {
  const eventos = await eventoService.findAll();
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
