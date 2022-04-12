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
  const userData = { ...req.user };
  const adiestradorData = { ...req.adiestrador };

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
    const adiestradorActualizado = await adiestradorService.update(
      req.params.idAdiestrador,
      req.body
    );
    res.status(200).send(adiestradorActualizado);
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

exports.updatePerfil = async (req, res, next) => {
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  try {
    const perfilActualizado = await perfilService.update(
      adiestrador.idPerfil,
      req.body
    );
    res.status(200).send(perfilActualizado);
  } catch (err) {
    next(err);
  }
};
