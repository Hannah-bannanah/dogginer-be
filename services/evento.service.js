// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const Evento = require('../models/evento.model');
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const { AUTHORITIES } = require('../util/auth.config');

/**
 * Recoge la lista de todos los eventos de la bbdd
 * @returns la lista de eventos
 */
exports.findAll = async () => {
  const eventos = await Evento.find();
  return eventos;
};

/**
 * Recoge la lista de todos los eventos publicos de la bbdd
 * @returns la lista de eventos
 */
exports.findPublic = async () => {
  const eventos = await Evento.find({ invitados: { $eq: [] } });
  return eventos;
};

/**
 * Recoge la lista de todos los eventos publicos de la bbdd
 * @returns la lista de eventos
 */
exports.findAccessible = async (userId, role) => {
  let eventos = [];

  // buscamos los eventos accesibles para el adiestrador
  if (role === AUTHORITIES.ADIESTRADOR) {
    const adiestrador = await adiestradorService.findByUserId(userId);
    if (!adiestrador._id) throw new Error('Adiestrador no existe');

    eventos = await Evento.find({
      $or: [{ invitados: { $eq: [] } }, { idAdiestrador: adiestrador._id }]
    });
  }

  if (role === AUTHORITIES.CLIENTE) {
    const cliente = await clienteService.findByUserId(userId);
    if (!cliente._id) throw new Error('Cliente no existe');

    eventos = await Evento.find({
      $or: [{ invitados: { $eq: [] } }, { invitados: cliente }]
    });
  }

  return eventos;
};

/**
 * Busca un evento por id
 * @param {String} idEvento el id de evento
 * @returns el documento del evento buscado, un objeto vacio si no existe
 */
exports.findById = async (idEvento) => {
  if (!mongoose.Types.ObjectId.isValid(idEvento)) return {};

  const evento = await Evento.findById(idEvento);
  return evento || {};
};

/**
 * Crea un nuevo evento en la bbdd
 * @param {Object} eventoData los datos del evento
 * @returns el objeto evento creado
 * @throws error si el idAdiestrador no existe
 */
exports.create = async (eventoData) => {
  const adiestrador = await adiestradorService.findById(
    eventoData.idAdiestrador
  );
  if (!adiestrador._id) {
    const error = new Error('Informacion invalida');
    error.httpStatus = 422;
    throw error;
  }
  const evento = new Evento({ ...eventoData });
  await evento.save();
  adiestrador.eventos.push(evento._id);
  await adiestrador.save();
  return evento;
};

/**
 * Busca un evento por id y lo elimina de la bbdd
 * @param {Object} idEvento
 * @returns un objeto vacio
 */
exports.deleteById = async (idEvento) => {
  let result = { deletedCount: 0 };
  const evento = await this.findById(idEvento);
  if (evento._id) {
    await adiestradorService.removeEvento(evento);
    await clienteService.removeEvento(idEvento);
    result = await Evento.deleteOne({ _id: idEvento });
  }
  return result.deletedCount > 0;
};

/**
 * Busca un evento y actualiza su informacion
 * @param {String} idEvento el id del evento
 * @param {Object} newData los datos a actualizar
 * @returns el documento del evento actualizado en la bbdd
 * @throws error si el idEvento no existe
 */
exports.update = async (idEvento, newData) => {
  const eventoExistente = await this.findById(idEvento);

  if (!eventoExistente._id) {
    const error = new Error('Evento no encontrado');
    error.httpStatus = 404;
    throw error;
  }
  await Evento.findByIdAndUpdate(idEvento, {
    ...newData,
    idAdiestrador: undefined // de momento, ignoramos cambios en el adiestrador
  });
  return await this.findById(idEvento);
};

/**
 * Busca una lista de eventos por sus ids
 * @param {Array} eventos lista de ids de eventos
 * @returns la lista de eventos encontrados
 */
exports.findByIdList = async (eventos) => {
  return await Evento.find({ _id: { $in: eventos } });
};
