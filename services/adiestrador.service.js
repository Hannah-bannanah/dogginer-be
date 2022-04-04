//import 3rd party modules

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
 * @returns el documento del adiestrador buscado, null si no existe
 */
exports.findById = async (idAdiestrador) => {
  try {
    const adiestrador = await Adiestrador.findById(idAdiestrador);
    return adiestrador;
  } catch (err) {
    console.log(err);
  }

  return {};
};

/**
 * Crea un nuevo adiestrador en la bbdd
 * @param {*} reqData los datos del adiestrador
 * @returns true si el documento se ha creado con exito, false si no
 */
exports.create = async (reqData) => {
  const adiestrador = new Adiestrador({ ...reqData }); // mongoose valida la estructura del objeto
  // let exito = false;
  try {
    await adiestrador.save();
    // console.log('adiestrador creado');
    // exito = true;
    return adiestrador;
  } catch (err) {
    console.log(err);
  }

  return {};
};

exports.deleteById = async (idAdiestrador) => {
  // const resultado = Adiestrador.find({ _id: idAdiestrador });
  let resultado;
  try {
    resultado = await Adiestrador.deleteOne({ _id: idAdiestrador });
  } catch (err) {
    console.log(err);
    resultado = null;
  }
  return resultado;
};
