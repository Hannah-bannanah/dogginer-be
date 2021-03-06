// import 3rd party modules
const mongoose = require('mongoose');
const crypto = require('crypto');

// import internal modules
const User = require('../models/user.model');
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const { HttpError } = require('../util/error.class');

/**
 * Recoge la lista de todos los users de la bbdd
 * @returns la lista de users
 */
exports.findAll = async () => {
  const users = await User.find().select({ password: 0 });
  return users;
};

/**
 * Busca un user por id
 * @param {String} userId el id de user
 * @returns el documento del user buscado, un objeto vacio si no existe
 */
exports.findById = async userId => {
  let user;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId).select({ password: 0 });
  }
  return user || {};
};

/**
 * Busca un user por email
 * @param {String} email el email del user
 * @returns el documento del user buscado o un objeto vacio si no existe
 */
exports.findByEmail = async email => {
  const user = email
    ? await User.findOne({ email: email.toLowerCase() })
    : {};
  return user || {};
};

/**
 * Busca por username
 * @param {String} username
 * @returns el documento del user buscado o un objeto vacio si no existe
 */
exports.findByUsername = async username => {
  const user = username
    ? await User.findOne({ username: username.toLowerCase() }).select({ password: 0 }
    )
    : {};
  return user || {};
};

/**
 * Crea un nuevo user en la bbdd
 * @param {Object} userData los datos del user
 * @returns el objeto user creado
 */
exports.create = async userData => {
  const user = new User(userDataParser(userData)); // mongoose valida la estructura del objeto
  await user.save();
  return user;
};

/**
 * Busca un user por id y lo elimina de la bbdd
 * @param {String} userId
 * @returns true si se ha eliminado un documento, false si no
 * @throws error si existe una cuenta de adiestrador o cliente asociada
 */
exports.deleteById = async userId => {
  let result = { deletedCount: 0 };
  if (mongoose.Types.ObjectId.isValid(userId)) {
    const adiestrador = await adiestradorService.findByUserId(userId);
    const cliente = await clienteService.findByUserId(userId);

    if (adiestrador._id || cliente._id) {
      throw new HttpError('Cuenta de adiestrador o cliente activa', 400);
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
  const userExistente = await User.findByIdAndUpdate(userId,
    { ...userDataParser(newData), password: undefined }
  ) || {};
  const userActualizado = userExistente._id
    ? await User.findById(userExistente._id).select({ password: 0 })
    : {};
  return userActualizado || {};
};

/**
 * Genera un token aleatorio y se lo a??ade al documento del usuario
 * @param {String} email el email del usuario que quiere resetear la password
 */
exports.generateResetToken = async email => {
  const buffer = crypto.randomBytes(32);
  const token = buffer.toString('hex');

  const user = await User.findOne({ email: email.toLowerCase() }) || {};
  if (!user._id) throw new HttpError('User no existe', 404);

  user.tempResetToken = token;
  user.tokenValidity = Date.now() + 3600000;

  await user.save();
  return user;
};

/**
 * Actualiza la password de un usuario
 * @param {String} userId el id del user
 * @param {String} token el token aleatorio generado para el reseteo
 * @param {String} newPassword el nuevo valor de la password
 * @returns true si la operacion se ha completado con exito, false si no;
 * @throws error si el usuario no existe
 */
exports.updatePassword = async (userId, token, newPassword) => {
  const user = await User.findOne({ _id: userId }) || {};
  if (!user._id) throw new HttpError('User no existe', 404);
  if (
    user.tempResetToken === token &&
    user.tokenValidity > Date.now()
  ) {
    user.password = newPassword;

    await user.save();
    return true;
  }
  return false;
};

/**
 * Busca todos los usuarios de una lista de userIds
 * @param {Array} userIds
 * @returns la lista de usuarios
 */
exports.findByIdList = async userIds => {
  const users = User.find({ _id: { $in: userIds } }).select({
    password: 0
  });
  return users || [];
};

/**
 * Parseador de datos del user
 * @param {Object} userData
 * @returns un objeto de usuario valido
 */
const userDataParser = userData => {
  const output = {
    ...userData,
    username: userData.username
      ? userData.username.toLowerCase()
      : undefined,
    email: userData.email ? userData.email.toLowerCase() : undefined
  };
  return output;
};
