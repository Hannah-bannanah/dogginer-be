//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules
const Cliente = require('../models/cliente.model');
const userService = require('../services/user.service');
const { AUTHORITIES } = require('../util/authorities.config');

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
exports.findById = async idCliente => {
  if (!mongoose.Types.ObjectId.isValid(idCliente)) return {};

  const cliente = await Cliente.findById(idCliente);
  return cliente ? cliente : {};
};

/**
 * Crea un nuevo cliente en la bbdd
 * @param {Object} clienteData los datos del cliente
 * @returns el objeto cliente creado
 */
exports.create = async clienteData => {
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
 * @param {Object} idCliente
 * @returns un objeto vacio
 */
exports.deleteById = async idCliente => {
  if (mongoose.Types.ObjectId.isValid(idCliente)) {
    await Cliente.deleteOne({ _id: idCliente });
  }
  return {};
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
  await Cliente.findByIdAndUpdate(idCliente, newData);
  return await this.findById(idCliente);
};
