// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const perfilService = require('../services/perfil.service');

exports.findAll = async (req, res, next) => {
  const perfiles = await perfilService.findAll();
  res.status(200).send(perfiles);
};

exports.findById = async (req, res, next) => {
  try {
    const perfil = await perfilService.findById(req.params.idPerfil);
    res.status(200).send(perfil);
  } catch (err) {
    next(err);
  }
};

// exports.findByEmail = async (req, res, next) => {
//   res.status(200).send(req.params.email);
// };
exports.create = async (req, res, next) => {
  const reqData = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const resultado = await perfilService.create(reqData);
    res.status(201).send({ _id: resultado._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    await perfilService.deleteById(req.params.idPerfil);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const resultado = await perfilService.update(
      req.params.idPerfil,
      req.body
    );
    res.status(200).send(resultado);
  } catch (err) {
    next(err);
  }
};
