// import 3rd party modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// import internal modules
const userService = require('../services/user.service');
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const emailService = require('../services/email.service');
const { AUTHORITIES } = require('../util/auth.config');
const { HttpError } = require('../util/error.class');

exports.findAll = async (req, res, next) => {
  const users = await userService.findAll();
  res.status(200).send(users);
};

exports.findById = async (req, res, next) => {
  if (
    req.requesterData.userId !== req.params.userId &&
    req.requesterData.role !== AUTHORITIES.GOD
  ) {
    // const error = new Error('Unauthorized');
    // error.httpStatus = 403;
    return next(new HttpError('Unauthorized', 403));
  }
  try {
    const user = await userService.findById(req.params.userId);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const userData = { ...req.body };

  // validamos role
  if (userData.role === AUTHORITIES.GOD) {
    return next(new HttpError('No puedes crear a Dios', 403));
  }
  // validamos password
  const regex = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
  if (!regex.test(userData.password)) {
    return next(new HttpError('Password invalida', 400));
  }
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
    const result = await userService.deleteById(req.params.userId);
    if (result) res.status(204).send();
    else throw new HttpError('Error al eliminar el usuario', 500);
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

exports.generateLoginToken = async (req, res, next) => {
  try {
    const user = await userService.findByEmail(req.body.email);
    if (user._id) {
      const loginValido = await bcrypt.compare(
        req.body.password,
        user.password
      );
      const response = {};
      if (loginValido) {
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
            role: user.role
          },
          process.env.JWT_PASSPHRASE,
          { expiresIn: '1h' }
        );
        response.token = token;
        response.validity = 3600;
        response.role = user.role;
        response.userId = user._id;
        if (user.role === AUTHORITIES.ADIESTRADOR) {
          const adiestrador = await adiestradorService.findByUserId(user._id);
          response.idAdiestrador = adiestrador._id;
        }
        if (user.role === AUTHORITIES.CLIENTE) {
          const cliente = await clienteService.findByUserId(user._id);
          response.idCliente = cliente._id;
        }
        return res.status(200).send(response);
      }
    }

    // si el usuario no existe o la contraseña no coincide
    // generamos un error de autenticacion
    // const error = new Error('Credenciales no validos');
    // error.httpStatus = 401;
    next(new HttpError('Credenciales no validos', 401));
  } catch (err) {
    next(err);
  }
};

exports.generateResetToken = async (req, res, next) => {
  try {
    const user = await userService.generateResetToken(req.body.email);
    emailService.sendPwdResetEmail(user); // no esperamos respuesta
    res
      .status(200)
      .send({ success: true, message: `reset link sent to ${user.email}` });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const userId = req.params.userId;
  const newPassword = await bcrypt.hash(req.body.newPassword, 12);
  try {
    const resultado = await userService.updatePassword(
      userId,
      token,
      newPassword
    );
    if (resultado) {
      res
        .status(200)
        .send({ success: true, message: 'password actualizada con existo' });
    } else throw new HttpError('Error al actualziar la password', 500);
  } catch (err) {
    next(err);
  }
};
