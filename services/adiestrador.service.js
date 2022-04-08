//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules
const Adiestrador = require('../models/adiestrador.model');

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
 * @param {*} idAdiestrador el id de adiestrador
 * @returns el documento del adiestrador buscado, un objeto vacio si no existe
 */
exports.findById = async idAdiestrador => {
  if (!mongoose.Types.ObjectId.isValid(idAdiestrador)) return {};

  const adiestrador = await Adiestrador.findById(idAdiestrador);
  return adiestrador ? adiestrador : {};
};

/**
 * Crea un nuevo adiestrador en la bbdd
 * @param {*} reqData los datos del adiestrador
 * @returns true si el documento se ha creado con exito, false si no
 */
exports.create = async reqData => {
  const adiestrador = new Adiestrador({ ...reqData }); // mongoose valida la estructura del objeto
  await adiestrador.save();
  return adiestrador;
};

exports.deleteById = async idAdiestrador => {
  if (mongoose.Types.ObjectId.isValid(idAdiestrador))
    await Adiestrador.deleteOne({ _id: idAdiestrador });
  return;
};
