// import 3rd party modules

// import internal modules
const clienteService = require('../services/cliente.service');
const adiestradorService = require('../services/adiestrador.service');
const eventoService = require('../services/evento.service');
const emailService = require('../services/email.service');
const { AUTHORITIES } = require('../util/auth.config');
const { HttpError } = require('../util/error.class');

exports.findAll = async (req, res, next) => {
  if (req.requesterData.role === AUTHORITIES.GOD) {
    const clientes = await clienteService.findAll();
    res.status(200).send(clientes);
  } else if (req.requesterData.role === AUTHORITIES.ADIESTRADOR) {
    const usernames = await clienteService.getUsernames();
    res.status(200).send(usernames);
  } else {
    return next(new HttpError('Unauthorized', 403));
  }
};

exports.findById = async (req, res, next) => {
  try {
    const cliente = await clienteService.findById(req.params.idCliente);
    if (
      !cliente.userId ||
      (!cliente.userId.equals(req.requesterData.userId) &&
        req.requesterData.role !== AUTHORITIES.GOD)
    ) {
      return next(new HttpError('Unauthorized', 403));
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
    !cliente.userId ||
    (req.requesterData.userId !== cliente.userId &&
      req.requesterData.role !== AUTHORITIES.GOD)
  ) {
    return next(new HttpError('Unauthorized', 403));
  }
  try {
    const result = await clienteService.deleteById(cliente._id);
    if (result) res.status(204).send();
    else throw new HttpError('Error al eliminar el cliente', 500);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const clienteExistente = clienteService.findById(req.params.idCliente);
  if (
    !clienteExistente.userId ||
    (req.requesterData.userId !== clienteExistente.userId &&
      req.requesterData.role !== AUTHORITIES.GOD)
  ) {
    return next(new HttpError('Unauthorized', 403));
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

  if (!req.body.destinatario) {
    return next(new HttpError('Introduzca un destinatario', 422));
  }

  let adiestrador = await adiestradorService.findById(req.body.destinatario);
  if (!adiestrador._id) {
    adiestrador = await adiestradorService.findByUsername(
      req.body.destinatario
    );
  }
  if (!adiestrador._id) {
    return next(new HttpError('Adiestrador no existe', 404));
  }
  try {
    await emailService.sendEmail(
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
