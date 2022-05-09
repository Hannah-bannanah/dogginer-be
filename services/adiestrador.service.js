// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const Adiestrador = require('../models/adiestrador.model');
const userService = require('../services/user.service');
const clienteService = require('../services/cliente.service');
const eventoService = require('../services/evento.service');
const { AUTHORITIES } = require('../util/auth.config');
const { HttpError } = require('../util/error.class');

/**
 * Recoge la lista de todos los adiestradores de la bbdd
 * @returns la lista de adiestradores
 */
exports.findAll = async () => {
  return await Adiestrador.find().select({ _ratings: 0 });
};

/**
 * Busca un adiestrador por id
 * @param {String} idAdiestrador el id de adiestrador
 * @returns el documento del adiestrador buscado, un objeto vacio si no existe
 */
exports.findById = async (idAdiestrador) => {
  let adiestrador;
  if (mongoose.Types.ObjectId.isValid(idAdiestrador)) {
    adiestrador = await Adiestrador.findById(idAdiestrador);
  }
  return adiestrador || {};
};

/**
 * Busca un adiestrador por el id de la cuenta de usuario asociada
 * @param {String} userId
 * @returns el documento de adiestrador, un objeto vacio si no existe
 */
exports.findByUserId = async (userId) => {
  return await Adiestrador.findOne({ userId: userId }).select({ _ratings: 0 });
};

/**
 * Busca un adiestrador por el username de la cuenta de usuario asociada
 * @param {String} username
 * @returns el objeto cliente si existe, un objeto vacio si no
 */
// exports.findByUsername = async (username) => {
//   const user = await userService.findByUsername(username);
//   return user._id ? await Adiestrador.findOne({ userId: user._id }) : {};
// };

/**
 * Crea un nuevo adiestrador en la bbdd
 * @param {Object} adiestradorData los datos del adiestrador
 * @returns el objeto adiestrador creado
 * @throws error si el userId no tiene asignado el rol de adiestrador
 */
exports.create = async (adiestradorData) => {
  const user = await userService.findById(adiestradorData.userId);
  if (!user || user.role !== AUTHORITIES.ADIESTRADOR) {
    // const error = new Error();
    // error.httpStatus = 422;
    // error.message = 'Informacion invalida';
    throw new HttpError('Informacion invalida', 422);
  }
  const adiestrador = new Adiestrador({ ...adiestradorData }); // mongoose valida la estructura del objeto
  await adiestrador.save();
  return adiestrador;
};

/**
 * Busca un adiestrador por id y lo elimina de la bbdd
 * @param {String} idAdiestrador
 * @returns true si se ha eliminado un documento, false si no
 */
exports.deleteById = async (idAdiestrador) => {
  let result = { deletedCount: 0 };
  const adiestrador = await this.findById(idAdiestrador);
  if (!adiestrador._id) {
    throw new HttpError('Adiestrador no existe', 404);
  }
  if (adiestrador.eventos) {
    const eventos = await eventoService.findByIdList(adiestrador.eventos);
    if (eventos.filter((e) => !e.terminado).length) {
      // const error = new Error('Adiestrador tiene eventos activos');
      // error.httpStatus = 422;
      throw new HttpError('Adiestrador tiene eventos activos', 422);
    }
  }
  result = await Adiestrador.deleteOne({ _id: idAdiestrador });
  if (result > 0) result = await userService.deleteById(adiestrador.userId);
  return result.deletedCount > 0;
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
    // const error = new Error('Adiestrador no encontrado');
    // error.httpStatus = 404;
    throw new HttpError('Adiestrador no existe', 404);
  }
  const adiestradorActualizado = await Adiestrador.findByIdAndUpdate(
    idAdiestrador,
    newData
  );
  return adiestradorActualizado;
};

/**
 * Elimina un evento del la lista de eventos de su adiestrador
 * @param {Object} evento
 */
exports.removeEvento = async (evento) => {
  await Adiestrador.findOneAndUpdate(
    { _id: evento.idAdiestrador },
    { $pull: { eventos: { _id: evento._id } } }
  );
};

/**
 * Añade un rating a la lista de ratings del adiestrador
 * @param {String} idAdiestrador
 * @param {Object} rating objeto de formato {idCliente: string, rating: numero}
 * @returns el rating medio del adiestrador
 * @throws error si el adiestrador no existe, si el cliente no tiene eventos
 * en comun con el adiestrador o si el rating no esta en el rango [0, 5]
 */
exports.rate = async (idAdiestrador, rating) => {
  // comprobamos el rango del rating
  if (rating.score > 5 || rating.score < 1) {
    // const error = new Error('Score fuera del rango permitido');
    // error.httpStatus = 422;
    throw new HttpError('Score fuera del rango permitido', 422);
  }

  // comprobamos que el adiestrador existe
  let adiestrador;
  if (mongoose.Types.ObjectId.isValid(idAdiestrador)) {
    adiestrador = await Adiestrador.findById(idAdiestrador); //necesitamos recibir _ratings
  }
  if (!adiestrador._id) {
    // const error = new Error('Adiestrador no existe');
    // error.httpStatus = 404;
    throw new HttpError('Adiestrador no existe', 404);
  }

  // comprobamos que el cliente esta registrado en al menos
  // un evento del adiestrador
  const clientesAdiestrador = await clienteService.findByAdiestrador(
    adiestrador
  );
  if (
    clientesAdiestrador
      .map((c) => c._id)
      .filter((id) => id.equals(mongoose.Types.ObjectId(rating.idCliente)))
      .length
  ) {
    // si el adiestrador ya tiene un rating del cliente
    // lo eliminamos antes de añadir el nuevo
    adiestrador._ratings = adiestrador._ratings.filter(
      (r) => !r.idCliente.equals(rating.idCliente)
    );

    adiestrador._ratings.push(rating);
    await adiestrador.save();
  } else {
    // const error = new Error('Cliente no tiene historial con el adiestrador');
    // error.httpStatus = 403;
    throw new HttpError('Unauthorized', 403);
  }

  // devolvemos la nueva media
  return adiestrador;
};
