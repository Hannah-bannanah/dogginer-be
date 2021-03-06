// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const Evento = require('../models/evento.model');
const adiestradorService = require('../services/adiestrador.service');
const clienteService = require('../services/cliente.service');
const { AUTHORITIES } = require('../util/auth.config');
const { HttpError } = require('../util/error.class');

/**
 * Recoge la lista de todos los eventos de la BD, incluyendo los terminados
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
  const eventos = await Evento.find({
    invitados: [],
    fecha: { $gt: Date.now() }
  });
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
    if (!adiestrador._id) throw new HttpError('Adiestrador no existe', 404);

    eventos = await Evento.find({
      fecha: { $gt: Date.now() },
      $or: [{ invitados: [] }, { idAdiestrador: adiestrador._id }]
    });
  }

  if (role === AUTHORITIES.CLIENTE) {
    const cliente = await clienteService.findByUserId(userId);
    if (!cliente._id) throw new HttpError('Cliente no existe', 404);
    eventos = await Evento.find({
      fecha: { $gt: Date.now() },
      $or: [{ invitados: [] }, { invitados: cliente }]
    });
  }

  return eventos;
};

/**
 * Busca los eventos asociados a un adiestrador
 * @param {Array} eventos lista de ids de eventos
 * @returns la lista de eventos encontrados
 */
exports.findByAdiestrador = async (adiestrador, userData) => {
  // si el evento no es publico, comprobamos si el usuario tiene acceso

  if (userData && adiestrador.userId.equals(userData.userId)) {
    return await Evento.find({
      idAdiestrador: adiestrador._id,
      fecha: { $gt: Date.now() }
    });
  }

  if (userData && userData.role === AUTHORITIES.CLIENTE) {
    const cliente = await clienteService.findByUserId(userData.userId);
    return await Evento.find({
      idAdiestrador: adiestrador.id,
      fecha: { $gt: Date.now() },
      $or: [{ invitados: [] }, { invitados: cliente }]
    });
  }
  return await Evento.find({
    idAdiestrador: adiestrador._id,
    invitados: [],
    fecha: { $gt: Date.now() }
  });
};

/**
 * Busca los eventos en los que esta registrado un cliente
 * @param {Object} cliente
 * @returns la lista de eventos encontrados
 */
exports.findByCliente = async (cliente) => {
  return await Evento.find({
    _id: { $in: cliente.eventos },
    fecha: { $gt: Date.now() }
  });
};

/**
 * Busca un evento por id
 * @param {String} idEvento el id de evento
 * @returns el documento del evento buscado, un objeto vacio si no existe
 */
exports.findById = async (idEvento, userData) => {
  if (!mongoose.Types.ObjectId.isValid(idEvento)) return {};

  const evento = await Evento.findById(idEvento);

  // si el evento existe y es publico, lo devolvemos
  if (!evento) return {};
  if (!evento.privado) return evento;

  // si el evento no es publico, comprobamos si el usuario tiene acceso
  if (!userData) throw new HttpError('Unauthorized', 403);

  if (userData.role === AUTHORITIES.GOD) return evento;

  if (userData.role === AUTHORITIES.ADIESTRADOR) {
    const adiestrador = await adiestradorService.findByUserId(userData.userId);
    return evento.idAdiestrador.equals(adiestrador._id) ? evento : {};
  }

  if (userData.role === AUTHORITIES.CLIENTE) {
    const cliente = await clienteService.findByUserId(userData.userId);
    return evento.invitados.find((invitado) => invitado.equals(cliente))
      ? evento
      : {};
  }
};

/**
 * Crea un nuevo evento en la bbdd
 * @param {Object} eventoData los datos del evento
 * @returns el objeto evento creado
 * @throws error si el idAdiestrador no existe
 */
exports.create = async (eventoData, adiestrador) => {
  const evento = new Evento({ ...eventoData, invitados: undefined });
  await evento.save();
  if (eventoData.invitados) {
    for (const invitado of eventoData.invitados) {
      const cliente = await clienteService.findById(invitado.idCliente || '');
      if (cliente._id) evento.invitados.push(cliente._id);
      cliente.save();
    }

    evento.save();
  }
  adiestrador.eventos.push(evento);
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
  const evento = await this.findById(idEvento) || {};
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
