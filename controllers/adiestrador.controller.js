// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const adiestradorService = require('../services/adiestrador.service');

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

// exports.findByEmail = async (req, res, next) => {
//   res.status(200).send(req.params.email);
// };
exports.createAdiestrador = async (req, res, next) => {
  const reqData = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const resultado = await adiestradorService.create(reqData);
    res.status(201).send({ _id: resultado._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    await adiestradorService.deleteById(req.params.idAdiestrador);
    res.status(200).send({});
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
