//import 3rd party modules
const mongoose = require('mongoose');

//create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Perfil';

const perfilSchemaDetails = {
  idAdiestrador: {
    type: Schema.Types.ObjectId,
    ref: 'Adiestrador',
    required: true,
    unique: true,
    immutable: true,
  },
  precio: {
    type: Number,
  },
  contacto: {
    type: String,
  },
};

const perfilSchema = new Schema(perfilSchemaDetails, {
  strictQuery: false,
});

//create model
const perfilModel = mongoose.model(COLLECTION_NAME, perfilSchema);

module.exports = perfilModel;
