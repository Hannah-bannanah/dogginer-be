//import 3rd party modules
const mongoose = require('mongoose');

//create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Perfil';

const perfilSchemaDetails = {
  adiestradorId: {
    type: Schema.Types.ObjectId,
    ref: 'Adiestrador',
    required: true,
    unique: true,
  },
  precio: {
    type: Number,
  },
  contacto: {
    type: String,
    required: true,
  },
};

const perfilSchema = new Schema(perfilSchemaDetails, {
  strictQuery: false,
});

//create model
const perfilModel = mongoose.model(COLLECTION_NAME, perfilSchema);

module.exports = perfilModel;
