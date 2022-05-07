// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules
const Cliente = require('../models/cliente.model');
const userService = require('../services/user.service');
const eventoService = require('../services/evento.service');
const { AUTHORITIES } = require('../util/auth.config');

/**
 * Recoge la lista de todos los clientes de la bbdd
 * @returns la lista de clientes
 */
exports.findAll = async () => {
  const clientes = await Cliente.find();
  return clientes;
};

/**
 * Busca los usernames de los clientes de una lista de idCliente.
 * Si no se incluye el parametro listaClientes, devuelve los usernames
 * de todos los clientes
 * @param {Array} listaClientes la lista de ids buscados
 * @returns la lista de usernames
 */
exports.getUsernames = async (listaClientes) => {
  let query = listaClientes
    ? [{ $match: { _id: { $in: listaClientes } } }]
    : [];
  query = [
    ...query,
    {
      $lookup: {
        from: 'users', // collection name in db
        localField: 'userId',
        foreignField: '_id',
        as: 'username'
      }
    },
    {
      $set: {
        username: { $arrayElemAt: ['$username.username', 0] }
      }
    },
    {
      $project: { username: 1, _id: 0 }
    }
  ];
  const clientes = await Cliente.aggregate(query);
  return clientes;
};

/**
 * Busca un cliente por id
 * @param {String} idCliente el id de cliente
 * @returns el documento del cliente buscado, un objeto vacio si no existe
 */
exports.findById = async (idCliente) => {
  if (!mongoose.Types.ObjectId.isValid(idCliente)) return {};

  const cliente = await Cliente.findById(idCliente);
  return cliente || {};
};

/**
 * Busca un cliente por el id de la cuenta de usuario asociada
 * @param {String} userId
 * @returns el documento de cliente, un objeto vacio si no existe
 */
exports.findByUserId = async (userId) => {
  return await Cliente.findOne({ userId: userId });
};

/**
 * Busca un cliente por el username de la cuenta de usuario asociada
 * @param {String} username
 * @returns el objeto cliente si existe, un objeto vacio si no
 */
exports.findByUsername = async (username) => {
  const user = await userService.findByUsername(username);
  return user._id ? await Cliente.findOne({ userId: user._id }) : {};
};

/**
 * Crea un nuevo cliente en la bbdd
 * @param {Object} clienteData los datos del cliente
 * @returns el objeto cliente creado
 */
exports.create = async (clienteData) => {
  const user = await userService.findById(clienteData.userId);
  if (!user || user.role !== AUTHORITIES.CLIENTE) {
    const error = new Error();
    error.httpStatus = 422;
    error.message = 'Informacion invalida';
    throw error;
  }
  const cliente = new Cliente({ ...clienteData }); // mongoose valida la estructura del objeto
  await cliente.save();
  return cliente;
};

/**
 * Busca un cliente por id y lo elimina de la bbdd
 * @param {String} idCliente
 * @returns true si se ha eliminado un documento, false si no
 */
exports.deleteById = async (idCliente) => {
  let result = { deletedCount: 0 };
  const cliente = await this.findById(idCliente);
  if (!cliente._id) {
    const error = new Error('Cliente no existe');
    error.httpStatus = 404;
    throw error;
  }
  if (cliente.eventos) {
    const eventos = await eventoService.findByIdList(cliente.eventos);
    if (eventos.filter((e) => !e.terminado).length) {
      const error = new Error('Cliente tiene eventos activos');
      error.httpStatus = 422;
      throw error;
    }
  }
  result = await Cliente.deleteOne({ _id: idCliente });
  if (result > 0) result = await userService.deleteById(cliente.userId);
  return result.deletedCount > 0;
};

/**
 * Busca un cliente y actualiza su informacion
 * @param {String} idCliente el id del cliente
 * @param {Object} newData los datos a actualizar
 * @returns el documento del cliente actualizado en la bbdd
 * @throws error si el idCliente no existe
 */
exports.update = async (idCliente, newData) => {
  const clienteExistente = await this.findById(idCliente);
  if (!clienteExistente._id) {
    const error = new Error('Cliente no encontrado');
    error.httpStatus = 404;
    throw error;
  }
  const clienteActualizado = await Cliente.findByIdAndUpdate(
    idCliente,
    newData
  );
  return clienteActualizado;
};

/**
 * Elimina un evento del la lista de eventos de todos los clientes
 * @param {String} idEvento
 */
exports.removeEvento = async (idEvento) => {
  await Cliente.updateMany({}, { $pull: { eventos: { _id: idEvento } } });
};

/**
 * Elimina un evento del la lista de eventos del cliente
 * @param {String} idEvento
 * @param {String} idCliente
 */
exports.cancelarAsistencia = async (idEvento, idCliente) => {
  await Cliente.updateOne(
    { _id: idCliente },
    { $pull: { eventos: { _id: idEvento } } }
  );
};

/**
 * Busca todos los clientes registrados en eventos de un adiestrador
 * @param {String} adiestrador
 * @returns la lista de clientes
 */
exports.findByAdiestrador = async (adiestrador) => {
  const eventos = adiestrador.eventos;
  const clientes = await Cliente.find({
    eventos: {
      $in: eventos
    }
  });
  return clientes;
};

/**
 * Añade un evento a la lista de eventos del cliente
 * @param {Object} cliente el cliente
 * @param {String} idEvento el id del evento
 * @returns true si la operacion se realiza con exito, false si no
 * @throws error si el evento no existe o si ya esta en la lista de eventos del cliente
 */
exports.addEvento = async (cliente, idEvento) => {
  if (cliente.eventos.filter((e) => e._id.equals(idEvento)).length) {
    const error = new Error('Cliente ya registrado');
    error.httpStatus = 409;
    throw error;
  }

  const evento = await eventoService.findById(idEvento, {
    userId: cliente.userId,
    role: AUTHORITIES.CLIENTE
  });
  if (!evento._id) {
    const error = new Error('Evento no existe');
    error.httpStatus = 404;
    throw error;
  }
  if (
    evento.privado &&
    !evento.invitados.find((invitado) => invitado.equals(cliente))
  ) {
    const error = new Error('Operacion no autorizada');
    error.httpStatus = 403;
    throw error;
  }
  const asistentes = await Cliente.countDocuments({
    eventos: { $in: { _id: idEvento } }
  });
  if (evento.maxAforo && asistentes < evento.maxAforo) {
    cliente.eventos.push(evento);
    await cliente.save();
    return true;
  }
  return false;
};
