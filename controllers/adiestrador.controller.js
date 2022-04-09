// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const adiestradorService = require('../services/adiestrador.service');
const perfilService = require('../services/perfil.service');

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
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const reqData = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const adiestrador = await adiestradorService.create(reqData);
    res.status(200).send({ _id: adiestrador._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    await adiestradorService.deleteById(req.params.idAdiestrador);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const resultado = await adiestradorService.update(
      req.params.idAdiestrador,
      req.body
    );
    res.status(200).send(resultado);
  } catch (err) {
    next(err);
  }
};

exports.getPerfil = async (req, res, next) => {
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  if (!adiestrador.idPerfil) {
    const error = new Error();
    error.httpStatus = 404;
    error.message =
      'El adiestrador no existe o no dispone de perfil publico';
    next(error);
  } else {
    try {
      const perfil = await perfilService.findById(
        adiestrador.idPerfil
      );
      res.status(200).send(perfil);
    } catch (err) {
      next(err);
    }
  }
};

exports.createPerfil = async (req, res, next) => {
  if (req.params.idAdiestrador != req.body.idAdiestrador) {
    const error = new Error('Informacion invalida');
    error.httpStatus = 422;
    return next(error);
  }
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  try {
    const perfil = await perfilService.create(req.body, adiestrador);
    res.status(200).send({ id: perfil._id });
  } catch (err) {
    next(err);
  }
};
