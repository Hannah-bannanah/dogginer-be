// import 3rd party modules

// import internal modules
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const eventoService = require('../services/evento.service');
const emailService = require('../services/email.service');
const userService = require('../services/user.service');
const { AUTHORITIES } = require('../util/auth.config');
const { decodeToken } = require('../middleware/auth');

exports.findAll = async (req, res, next) => {
  const adiestradores = await adiestradorService.findAll();
  res.status(200).send(
    adiestradores.map((a) => {
      return { ...a._doc, _ratings: undefined };
    })
  );
};

exports.findById = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.findById(
      req.params.idAdiestrador
    );
    res.status(200).send({ ...adiestrador._doc, _ratings: undefined });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.create({
      ...req.body,
      _ratings: undefined,
      eventos: undefined
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
    else res.status(500).send();
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
    const updatedData = {
      ...req.body,
      _ratings: undefined,
      eventos: undefined
    };
    const adiestradorActualizado = await adiestradorService.update(
      req.params.idAdiestrador,
      updatedData
    );
    res.status(200).send({ ...adiestradorActualizado._doc, _ratings: 0 });
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
      const error = new Error('Informacion invalida');
      error.httpStatus = 422;
      throw error;
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
  const cliente = await clienteService.findById(req.params.idCliente);
  if (!cliente) {
    const error = new Error('Cliente no existe');
    error.httpStatus = 404;
    return next(error);
  }

  try {
    await emailService.sendPrivateEmail(
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
    const error = new Error('El asunto y el mensaje son obligatorios');
    error.httpStatus = 422;
    return next(error);
  }
  const adiestrador = req.adiestrador;
  const adiestradorUser = await userService.findById(adiestrador.userId);

  const clientes = await clienteService.findByAdiestrador(adiestrador);
  const users = await userService.findByIdList(clientes.map((c) => c.userId));
  const destinatarios = users.map((u) => u.email);

  const email = {
    to: 'hannah.fromspai@gmail.com',
    bcc: destinatarios,
    from: adiestradorUser.email,
    subject: req.body.asunto,
    html: req.body.mensaje
  };
  emailService.sendEmail(email);
  res.status(201).send();
};

exports.rate = async (req, res, next) => {
  // comprobamos que el idCliente coincide con el usuario autenticado
  const cliente = await clienteService.findByUserId(req.requesterData.userId);
  const rating = {
    idCliente: cliente._id,
    score: req.body.score
  };
  if (!rating.score) {
    const error = new Error('Informacion invalida');
    error.httpStatus = 422;
    return next(error);
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
