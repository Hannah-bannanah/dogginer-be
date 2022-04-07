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

  const adiestrador = await adiestradorService.create(reqData);
  res.status(201).send(adiestrador);
};

exports.deleteById = async (req, res, next) => {
  const result = await adiestradorService.deleteById(
    req.params.idAdiestrador
  );
  res.status(200).send(result);
};
