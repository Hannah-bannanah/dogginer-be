// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const User = require('../models/user.model');
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');

/**
 * Recoge la lista de todos los users de la bbdd
 * @returns la lista de users
 */
exports.findAll = async () => {
  const users = await User.find().select({ password: 0, __v: 0 });
  return users;
};

/**
 * Busca un user por id
 * @param {String} userId el id de user
 * @returns el documento del user buscado, un objeto vacio si no existe
 */
exports.findById = async (userId) => {
  let user = {};
  if (mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId).select({ password: 0, __v: 0 });
  }
  return user || {};
};

/**
 * Busca un user por email
 * @param {String} email el email del user
 * @returns el documento del user buscado o un objeto vacio si no existe
 */
exports.findByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user || {};
};

/**
 * Crea un nuevo user en la bbdd
 * @param {Object} userData los datos del user
 * @returns el objeto user creado
 */
exports.create = async (userData) => {
  const user = new User({ ...userData }); // mongoose valida la estructura del objeto
  await user.save();
  return user;
};

/**
 * Busca un user por id y lo elimina de la bbdd
 * @param {String} userId
 * @returns true si se ha eliminado un documento, false si no
 * @throws error si existe una cuenta de adiestrador o cliente asociada
 */
exports.deleteById = async (userId) => {
  let result = { deletedCount: 0 };
  if (mongoose.Types.ObjectId.isValid(userId)) {
    const adiestrador = adiestradorService.findByUserId(userId);
    const cliente = clienteService.findByUserId(userId);
    if (adiestrador._id || cliente._id) {
      const error = new Error('Cuenta de adiestrador o cliente activa');
      error.httpStatus = 409;
      throw error;
    }
    result = await User.deleteOne({ _id: userId });
  }
  return result.deletedCount > 0;
};

/**
 * Busca un user y actualiza su informacion
 * @param {String} userId el id del user
 * @param {Object} newData los datos a actualizar
 * @returns el documento del user actualizado en la bbdd
 * @throws error si el userId no existe
 */
exports.update = async (userId, newData) => {
  const userExistente = await this.findById(userId);
  if (!userExistente._id) {
    const error = new Error('User no encontrado');
    error.httpStatus = 404;
    throw error;
  }
  const userActualizado = await User.findByIdAndUpdate(userId, newData);
  return { ...userActualizado, password: undefined };
};
