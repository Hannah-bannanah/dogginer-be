// import 3rd party modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// import internal modules
const userService = require('../services/user.service');
const { JWT_PASSPHRASE } = require('../util/auth.config');

exports.findAll = async (req, res, next) => {
  const users = await userService.findAll();
  res.status(200).send(users);
};

exports.findById = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.userId);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const userData = { ...req.body };
  userData.password = await bcrypt.hash(userData.password, 12);
  try {
    const user = await userService.create(userData);
    res.status(200).send({ _id: user._id });
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    await userService.deleteById(req.params.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userActualizado = await userService.update(
      req.params.userId,
      req.body
    );
    res.status(200).send(userActualizado);
  } catch (err) {
    next(err);
  }
};

exports.generateToken = async (req, res, next) => {
  const user = await userService.findByEmail(req.body.email);
  if (user._id) {
    const loginValido = await bcrypt.compare(req.body.password, user.password);
    if (loginValido) {
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email
        },
        JWT_PASSPHRASE,
        { expiresIn: '1h' }
      );
      return res.status(200).send({ token: token, validity: 3600 });
    }
  }

  // si el usuario no existe o la contraseña no coincide
  // generamos un error de autenticacion
  const error = new Error('Credenciales no validos');
  error.httpStatus = 401;
  next(error);
};
