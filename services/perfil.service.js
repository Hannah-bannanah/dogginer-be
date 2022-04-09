//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules
const Perfil = require('../models/perfil.model');

/**
 * Recoge la lista de todos los perfiles de la bbdd
 * @returns la lista de perfiles
 */
exports.findAll = async () => {
  const perfiles = await Perfil.find();
  return perfiles;
};

/**
 * Busca un perfil por id
 * @param {String} idPerfil el id de perfil
 * @returns el documento del perfil buscado, un objeto vacio si no existe
 */
exports.findById = async idPerfil => {
  if (!mongoose.Types.ObjectId.isValid(idPerfil)) return {};

  const perfil = await Perfil.findById(idPerfil);
  return perfil ? perfil : {};
};

/**
 * Crea un nuevo perfil en la bbdd
 * @param {Object} reqData los datos del perfil
 * @returns el objeto perfil creado
 */
exports.create = async (reqData, adiestrador) => {
  const perfil = new Perfil({ ...reqData }); // mongoose valida la estructura del objeto
  await perfil.save();
  adiestrador.idPerfil = perfil._id;
  await adiestrador.save();
  return perfil;
};

/**
 * Busca un perfil por id y lo elimina de la bbdd
 * @param {String} idPerfil
 * @returns un objeto vacio
 */
exports.deleteById = async (idPerfil, adiestrador) => {
  if (mongoose.Types.ObjectId.isValid(idPerfil)) {
    await Perfil.deleteOne({ _id: idPerfil });
    adiestrador.idPerfil = undefined;
    await adiestrador.save();
  }
  return {};
};

/**
 * Busca un perfil y actualiza su informacion
 * @param {String} idPerfil el id del perfil
 * @param {Object} newData los datos a actualizar
 * @returns el documento del perfil actualizado en la bbdd
 * @throws error si el idPerfil no existe
 */
exports.update = async (idPerfil, newData) => {
  const adiestradorExistente = await this.findById(idPerfil);
  if (!adiestradorExistente._id) {
    const error = new Error('Perfil no encontrado');
    error.httpStatus = 404;
    throw error;
  }
  await Perfil.findByIdAndUpdate(idPerfil, newData);
  return await this.findById(idPerfil);
};
