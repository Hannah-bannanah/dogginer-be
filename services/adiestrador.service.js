// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const Adiestrador = require('../models/adiestrador.model');
const userService = require('../services/user.service');
const clienteService = require('../services/cliente.service');
const eventoService = require('../services/evento.service');
const { AUTHORITIES } = require('../util/auth.config');

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
exports.findById = async (idAdiestrador) => {
  if (!mongoose.Types.ObjectId.isValid(idAdiestrador)) return {};

  const adiestrador = await Adiestrador.findById(idAdiestrador);
  return adiestrador || {};
};

/**
 * Crea un nuevo adiestrador en la bbdd
 * @param {Object} adiestradorData los datos del adiestrador
 * @returns el objeto adiestrador creado
 * @throws error si el userId no tiene asignado el rol de adiestrador
 */
exports.create = async (adiestradorData) => {
  console.log('adiestrador data received in service', adiestradorData);
  const user = await userService.findById(adiestradorData.userId);
  console.log('user in service', user);
  if (!user || user.role !== AUTHORITIES.ADIESTRADOR) {
    console.log('user is not ADIESTRADOR');
    const error = new Error();
    error.httpStatus = 422;
    error.message = 'Informacion invalida';
    throw error;
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
    const error = new Error('Adiestrador no existe');
    error.httpStatus = 404;
    throw error;
  }
  if (adiestrador.eventos) {
    const eventos = await eventoService.findByIdList(adiestrador.eventos);
    if (eventos.filter((e) => !e.terminado).length) {
      const error = new Error('Adiestrador tiene eventos activos');
      error.httpStatus = 422;
      throw error;
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
    const error = new Error('Adiestrador no encontrado');
    error.httpStatus = 404;
    throw error;
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
 * Busca un adiestrador por el id de la cuenta de usuario asociada
 * @param {String} userId
 * @returns el documento de adiestrador, un objeto vacio si no existe
 */
exports.findByUserId = async (userId) => {
  return await Adiestrador.findOne({ userId: userId });
};

/**
 * Obtiene el rating medio del adiestrador
 * @param {String} idAdiestrador
 * @returns el rating medio del adiestrador
 */
exports.getRating = async (idAdiestrador) => {
  const rating = await Adiestrador.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(idAdiestrador) } },
    { $unwind: '$rating' },
    { $group: { _id: '$_id', avgScore: { $avg: '$rating.score' } } }
  ]);
  return rating[0].avgScore;
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
  if (rating.score > 5 || rating.score < 0) {
    const error = new Error('Score fuera del rango permitido');
    error.httpStatus = 422;
    throw error;
  }

  // comprobamos que el adiestrador existe
  const adiestrador = await this.findById(idAdiestrador);
  if (!adiestrador._id) {
    const error = new Error('Adiestrador no existe');
    error.httpStatus = 404;
    throw error;
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
    adiestrador.rating =
      adiestrador._ratings.map((r) => r.score).reduce((sum, val) => sum + val) /
      adiestrador._ratings.length;
    await adiestrador.save();
  } else {
    const error = new Error('Cliente no tiene historial con el adiestrador');
    error.httpStatus = 403;
    throw error;
  }

  // devolvemos la nueva media
  return adiestrador;
};
