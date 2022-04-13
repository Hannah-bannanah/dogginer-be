// import 3rd party modules

// import internal modules
const clienteService = require('../services/cliente.service');

exports.findAll = async (req, res, next) => {
  const clientes = await clienteService.findAll();
  res.status(200).send(clientes);
};

exports.findById = async (req, res, next) => {
  try {
    const cliente = await clienteService.findById(req.params.idCliente);
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
  try {
    await clienteService.deleteById(req.params.idCliente);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
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
