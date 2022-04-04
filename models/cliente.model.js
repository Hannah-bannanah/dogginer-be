//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules

//create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Cliente';

const clienteSchemaDetails = {
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
};
const clienteSchema = new Schema(clienteSchemaDetails, {
  strictQuery: false
});

//create model
const clienteModel = mongoose.model(COLLECTION_NAME, clienteSchema);

module.exports = clienteModel;
