// import 3rd party modules

// import internal modules
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const eventoService = require('../services/evento.service');
const emailService = require('../services/email.service');
const userService = require('../services/user.service');
const { AUTHORITIES } = require('../util/auth.config');
const { decodeToken } = require('../middleware/auth');
const { HttpError } = require('../util/error.class');

exports.findAll = async (req, res, next) => {
  try {
    const adiestradores = await adiestradorService.findAll();
    res.status(200).send(adiestradores);
  } catch (err) {
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.findById(
      req.params.idAdiestrador
    );
    res.status(200).send({ ...adiestrador._doc, _ratings: undefined });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.create({
      ...req.body,
      _ratings: undefined,
      eventos: undefined,
      imageUrl: req.body.imageUrl || undefined
    });
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
    !adiestrador.userId ||
    (req.requesterData.userId !== adiestrador.userId &&
      req.requesterData.role !== AUTHORITIES.GOD)
  ) {
    return next(new HttpError('Unauthorized', 403));
  }
  try {
    const result = await adiestradorService.deleteById(adiestrador._id);
    if (result) res.status(204).send();
    else throw new HttpError('Error al eliminar', 500);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const adiestradorExistente = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (
    !adiestradorExistente.userId ||
    (req.requesterData.userId !== adiestradorExistente.userId &&
      req.requesterData.role !== AUTHORITIES.GOD)
  ) {
    return next(new HttpError('Unauthorized', 403));
  }
  try {
    const updatedData = {
      ...req.body,
      _ratings: undefined,
      eventos: undefined
    };
    const adiestradorActualizado = await adiestradorService.update(
      req.params.idAdiestrador,
      updatedData
    );
    res
      .status(200)
      .send({ ...adiestradorActualizado._doc, _ratings: undefined });
  } catch (err) {
    next(err);
  }
};

exports.fetchClientes = async (req, res, next) => {
  const clientes = await clienteService.findByAdiestrador(req.adiestrador);
  const usernames = await clienteService.getUsernames(
    clientes.map((c) => c._id)
  );
  res.status(200).send(usernames);
};

exports.fetchEventos = async (req, res, next) => {
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (!adiestrador._id) {
    return next(new HttpError('Adiestrador no existe', 404));
  }

  // comprobamos si hemos recibido token
  let userData = null;
  try {
    userData = decodeToken(req);
  } catch (err) {
    // ignoramos el error, ya que userData es opcional
  }
  const eventos = await eventoService.findByAdiestrador(adiestrador, userData);
  res.status(200).send(eventos);
};

exports.createEvento = async (req, res, next) => {
  const eventoData = { ...req.body, idAdiestrador: req.params.idAdiestrador };
  try {
    const adiestrador = await adiestradorService.findById(
      req.params.idAdiestrador
    );
    if (!adiestrador._id) {
      throw new HttpError('Informacion invalida', 422);
    }
    const evento = await eventoService.create(eventoData, adiestrador);
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

exports.emailClient = async (req, res, next) => {
  const adiestrador = req.adiestrador;
  if (!req.body.destinatario) return next(new HttpError('Introduzca un destinatario', 422));

  const cliente = await clienteService.findByUsername(req.body.destinatario);
  if (!cliente) return next(new HttpError('Cliente no existe', 404));

  try {
    // verificamos que el cliente está relacionado con el adiestrador
    const interseccion = cliente.eventos.find((eventoCliente) => {
      const resultado = adiestrador.eventos.find((eventoAdiestrador) =>
        eventoAdiestrador.equals(eventoCliente)
      );
      return !!resultado;
    });
    if (!interseccion) throw new HttpError('Unauthorized', 403);

    await emailService.sendEmail(
      adiestrador,
      cliente,
      req.body.asunto,
      req.body.mensaje
    );
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};
exports.sendBroadCast = async (req, res, next) => {
  if (!req.body.asunto || !req.body.mensaje) {
    return next(new HttpError('El asunto y el mensaje son obligatorios', 422));
  }
  const adiestrador = req.adiestrador;
  // const adiestradorUser = await userService.findById(adiestrador.userId);

  const clientes = await clienteService.findByAdiestrador(adiestrador);
  const users = await userService.findByIdList(clientes.map((c) => c.userId));
  const destinatarios = users.map((u) => u.email);

  try {
    emailService.sendEmail(
      adiestrador,
      { email: 'dogginer@mail.com' },
      req.body.asunto,
      req.body.mensaje,
      destinatarios,
      true
    );
    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

exports.rate = async (req, res, next) => {
  // comprobamos que el idCliente coincide con el usuario autenticado
  const cliente = await clienteService.findByUserId(req.requesterData.userId);
  const rating = {
    idCliente: cliente._id,
    score: req.body.score
  };
  if (!rating.score) {
    return next(new HttpError('Informacion invalida', 422));
  }
  try {
    const adiestrador = await adiestradorService.rate(
      req.params.idAdiestrador,
      rating
    );
    res.status(200).send({ ...adiestrador._doc, _ratings: undefined });
  } catch (err) {
    next(err);
  }
};
