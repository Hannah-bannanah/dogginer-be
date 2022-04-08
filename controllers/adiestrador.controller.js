// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const adiestradorService = require('../services/adiestrador.service');

exports.findAll = async (req, res, next) => {
  const adiestradores = await adiestradorService.findAll();
  res.status(200).send(adiestradores);
};

exports.findById = async (req, res, next) => {
  const adiestrador = await adiestradorService.findById(
    req.params.idAdiestrador
  );
  res.status(200).send(adiestrador);
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
    if (err.code === 11000) {
      err.httpStatus = 400;
      err.message = 'Entrada duplicada';
    } else if (err instanceof mongoose.Error.ValidationError) {
      err.httpStatus = 422;
      err.message = 'Informacion invalida';
    }
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  const result = await adiestradorService.deleteById(
    req.params.idAdiestrador
  );
  res.status(200).send(result);
};
