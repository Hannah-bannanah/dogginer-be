// import 3rd party modules

// import internal modules
const clienteService = require('../services/cliente.service');
const adiestradorService = require('../services/adiestrador.service');
const eventoService = require('../services/evento.service');
const emailService = require('../services/email.service');
const { AUTHORITIES } = require('../util/auth.config');

exports.findAll = async (req, res, next) => {
  const clientes = await clienteService.findAll();
  res.status(200).send(clientes);
};

exports.findById = async (req, res, next) => {
  try {
    const cliente = await clienteService.findById(req.params.idCliente);
    if (
      !cliente.userId.equals(req.requesterData.userId) &&
      req.requesterData.role !== AUTHORITIES.GOD
    ) {
      const error = new Error('Unauthorized');
      error.httpStatus = 403;
      return next(error);
    }
    res.status(200).send(cliente);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const cliente = await clienteService.create(req.body);
    res.status(200).send({ _id: cliente._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  const cliente = await clienteService.findById(req.params.idCliente);
  if (
    req.requesterData.userId !== cliente.userId &&
    req.requesterData.role !== AUTHORITIES.GOD
  ) {
    const error = new Error('Unauthorized');
    error.httpStatus = 403;
    return next(error);
  }
  try {
    const result = await clienteService.deleteById(cliente._id);
    if (result) res.status(204).send();
    else res.status(500).send();
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const clienteExistente = clienteService.findById(req.params.idCliente);
  if (
    req.requesterData.userId !== clienteExistente.userId &&
    req.requesterData.role !== AUTHORITIES.GOD
  ) {
    const error = new Error('Unauthorized');
    error.httpStatus = 403;
    return next(error);
  }
  try {
    const clienteActualizado = await clienteService.update(
      req.params.idCliente,
      req.body
    );
    res.status(200).send(clienteActualizado);
  } catch (err) {
    next(err);
  }
};

exports.fetchEventos = async (req, res, next) => {
  const cliente = req.cliente;
  const eventos = await eventoService.findByCliente(cliente);
  res.status(200).send(eventos);
};

exports.getEvento = async (req, res, next) => {
  try {
    const evento = await eventoService.findById(req.params.idEvento);
    res.status(200).send(evento);
  } catch (err) {
    next(err);
  }
};

exports.cancelarEvento = async (req, res, next) => {
  try {
    await clienteService.cancelarAsistencia(
      req.params.idEvento,
      req.cliente._id
    );
    const clienteActualizado = await clienteService.findById(req.cliente._id);
    const eventosCliente = eventoService.findByCliente(clienteActualizado);
    res.status(200).send(eventosCliente);
  } catch (err) {
    next(err);
  }
};

exports.addEvento = async (req, res, next) => {
  try {
    const resultado = await clienteService.addEvento(
      req.cliente,
      req.body.idEvento
    );
    if (resultado) {
      const clienteActualizado = await clienteService.findById(req.cliente._id);
      const eventos = await eventoService.findByCliente(clienteActualizado);
      res.status(200).send(eventos);
    } else {
      res.status(422).send({ error: 'Evento sin capacidad' });
    }
  } catch (err) {
    next(err);
  }
};

exports.emailAdiestrador = async (req, res, next) => {
  const cliente = req.cliente;
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (!adiestrador) {
    const error = new Error('Adiestrador no existe');
    error.httpStatus = 404;
    return next(error);
  }

  try {
    await emailService.sendPrivateEmail(
      cliente,
      adiestrador,
      req.body.asunto,
      req.body.mensaje
    );
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};
