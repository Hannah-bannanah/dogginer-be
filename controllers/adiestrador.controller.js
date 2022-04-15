// import 3rd party modules

// import internal modules
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const eventoService = require('../services/evento.service');
const { AUTHORITIES } = require('../util/auth.config');

exports.findAll = async (req, res, next) => {
  const adiestradores = await adiestradorService.findAll();
  res.status(200).send(adiestradores);
};

exports.findById = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.findById(
      req.params.idAdiestrador
    );
    res.status(200).send(adiestrador);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.create(req.body);
    res.status(200).send({ _id: adiestrador._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (
    req.requesterData.userId !== adiestrador.userId &&
    req.requesterData.role !== AUTHORITIES.GOD
  ) {
    const error = new Error('Unauthorized');
    error.httpStatus = 403;
    return next(error);
  }
  try {
    const result = await adiestradorService.deleteById(adiestrador._id);
    if (result) res.status(204).send();
    else res.status(404).send();
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const adiestradorExistente = adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (
    req.requesterData.userId !== adiestradorExistente.userId &&
    req.requesterData.role !== AUTHORITIES.GOD
  ) {
    const error = new Error('Unauthorized');
    error.httpStatus = 403;
    next(error);
  }
  try {
    const adiestradorActualizado = await adiestradorService.update(
      req.params.idAdiestrador,
      req.body
    );
    res.status(200).send(adiestradorActualizado);
  } catch (err) {
    next(err);
  }
};

exports.fetchClientes = async (req, res, next) => {
  const clientes = await clienteService.findByAdiestrador(req.adiestrador);
  res.status(200).send(clientes);
};

exports.fetchEventos = async (req, res, next) => {
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (!adiestrador._id) {
    const error = new Error('Adiestrador no existe');
    error.httpStatus = 404;
    return next(error);
  }
  const eventos = await eventoService.findByIdList(adiestrador.eventos);
  res.status(200).send(eventos);
};

exports.createEvento = async (req, res, next) => {
  const eventoData = { ...req.body, idAdiestrador: req.params.idAdiestrador };
  try {
    const evento = await eventoService.create(eventoData);
    res.status(200).send({ id: evento._id });
  } catch (err) {
    next(err);
  }
};

exports.getEvento = async (req, res, next) => {
  try {
    const evento = await eventoService.findById(req.params.idEvento);
    res.status(200).send(evento);
  } catch (err) {
    next(err);
  }
};

exports.updateEvento = async (req, res, next) => {
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

exports.deleteEvento = async (req, res, next) => {
  try {
    await eventoService.deleteById(req.params.idEvento);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.sendBroadCast = async (req, res, next) => {
  res.status(201).send();
};
