// import 3rd party modules

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

exports.create = async (req, res, next) => {
  try {
    const adiestrador = await adiestradorService.create(req.body);
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
