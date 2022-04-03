//import 3rd party modules

//import internal modules
const Adiestrador = require('../models/adiestrador.model');

/**
 * Crea un nuevo adiestrador en la BBDD
 * @param {} adiestrador
 */
exports.create = async reqData => {
  const adiestrador = new Adiestrador({ ...reqData }); //mongoose valida la estructura del objeto
  let exito = false;
  try {
    await adiestrador.save();
    console.log('adiestrador creado');
    exito = true;
  } catch (err) {
    console.log(err);
  }

  return exito;
};
