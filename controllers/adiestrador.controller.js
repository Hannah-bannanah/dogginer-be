// import 3rd party modules

// import internal modules
const adiestradorService = require('../services/adiestrador.service');
const { AUTHORITIES } = require('../util/auth.config');

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
    console.log(err);
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.create(req.body);
    res.status(200).send({ _id: adiestrador._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  const adiestrador = adiestradorService.findById(req.params.idAdiestrador);
  if (
    req.requesterData.userId !== adiestrador.userId &&
    req.requesterData.role !== AUTHORITIES.GOD
  ) {
    const error = new Error('Unauthorized');
    error.httpStatus = 403;
    return next(error);
  }
  try {
    await adiestradorService.deleteById(adiestrador.idAdiestrador);
    res.status(204).send();
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
    const adiestradorActualizado = await adiestradorService.update(
      req.params.idAdiestrador,
      req.body
    );
    res.status(200).send(adiestradorActualizado);
  } catch (err) {
    next(err);
  }
};
