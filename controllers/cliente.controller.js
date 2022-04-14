// import 3rd party modules

// import internal modules
const clienteService = require('../services/cliente.service');
const { AUTHORITIES } = require('../util/auth.config');

exports.findAll = async (req, res, next) => {
  if (req.requesterData.role === AUTHORITIES.GOD) {
    const clientes = await clienteService.findAll();
    res.status(200).send(clientes);
  } else {
    const error = new Error('Unauthorized');
    error.httpStatus = 403;
    next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const cliente = await clienteService.findById(req.params.idCliente);
    if (
      req.requesterData.userId !== cliente.userId &&
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
    else res.status(404).send();
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
