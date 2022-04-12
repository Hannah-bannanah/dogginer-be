// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const userService = require('../services/user.service');

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
  try {
    const user = await userService.create(req.body);
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
