const adiestradorService = require('../services/adiestrador.service');

exports.createAdiestrador = async (req, res, next) => {
  const reqData = {
    email: req.body.email,
    password: req.body.password,
  };

  const adiestrador = await adiestradorService.create(reqData);
  res.status(200).send(adiestrador);
};
