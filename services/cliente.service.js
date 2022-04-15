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
  if (mongoose.Types.ObjectId.isValid(idCliente)) {
    result = await Cliente.deleteOne({ _id: idCliente });
  }
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
 * Busca un cliente por el id de la cuenta de usuario asociada
 * @param {String} userId
 * @returns el documento de cliente, un objeto vacio si no existe
 */
exports.findByUserId = async (userId) => {
  return await Cliente.findOne({ userId: userId });
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

exports.addEvento = async (cliente, idEvento) => {
  const evento = await eventoService.findById(idEvento);
  if (!evento._id) {
    const error = new Error('Evento no existe');
    error.httpStatus = 404;
    throw error;
  }
  const asistentes = await Cliente.countDocuments({
    eventos: { $in: { _id: idEvento } }
  });
  if (asistentes < evento.maxAforo) {
    cliente.eventos.push(evento);
    await cliente.save();
    return true;
  }
  return false;
};
