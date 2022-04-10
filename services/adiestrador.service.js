//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules
const Adiestrador = require('../models/adiestrador.model');
const Perfil = require('../models/perfil.model');

/**
 * Recoge la lista de todos los adiestradores de la bbdd
 * @returns la lista de adiestradores
 */
exports.findAll = async () => {
  const adiestradores = await Adiestrador.find();
  return adiestradores;
};

/**
 * Busca un adiestrador por id
 * @param {String} idAdiestrador el id de adiestrador
 * @returns el documento del adiestrador buscado, un objeto vacio si no existe
 */
exports.findById = async idAdiestrador => {
  if (!mongoose.Types.ObjectId.isValid(idAdiestrador)) return {};

  const adiestrador = await Adiestrador.findById(idAdiestrador);
  return adiestrador ? adiestrador : {};
};

/**
 * Crea un nuevo adiestrador en la bbdd
 * @param {Object} reqData los datos del adiestrador
 * @returns el objeto adiestrador creado
 */
exports.create = async reqData => {
  const adiestrador = new Adiestrador({ ...reqData }); // mongoose valida la estructura del objeto
  await adiestrador.save();
  return adiestrador;
};

/**
 * Busca un adiestrador por id y lo elimina de la bbdd
 * @param {Object} idAdiestrador
 * @returns un objeto vacio
 */
exports.deleteById = async idAdiestrador => {
  if (mongoose.Types.ObjectId.isValid(idAdiestrador)) {
    await Perfil.deleteOne({ idAdiestrador: idAdiestrador });
    await Adiestrador.deleteOne({ _id: idAdiestrador });
  }
  return {};
};

/**
 * Busca un adiestrador y actualiza su informacion
 * @param {String} idAdiestrador el id del adiestrador
 * @param {Object} newData los datos a actualizar
 * @returns el documento del adiestrador actualizado en la bbdd
 * @throws error si el idAdiestrador no existe
 */
exports.update = async (idAdiestrador, newData) => {
  const adiestradorExistente = await this.findById(idAdiestrador);
  if (!adiestradorExistente._id) {
    const error = new Error('Adiestrador no encontrado');
    error.httpStatus = 404;
    throw error;
  }
  await Adiestrador.findByIdAndUpdate(idAdiestrador, newData);
  return await this.findById(idAdiestrador);
};
