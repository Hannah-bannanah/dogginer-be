// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules

// create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Cliente';

const clienteSchemaDetails = {
  nombre: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
    unique: true
  },
  eventos: [
    {
      idEvento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento'
      }
    }
  ]
};
const clienteSchema = new Schema(clienteSchemaDetails, {
  strictQuery: false
});

// create model
const clienteModel = mongoose.model(COLLECTION_NAME, clienteSchema);

module.exports = clienteModel;
