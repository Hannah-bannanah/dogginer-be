// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules

// create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Evento';

const eventoSchemaDetails = {
  idAdiestrador: {
    type: Schema.Types.ObjectId,
    ref: 'Adiestrador',
    required: true
  },
  nombre: { type: String, required: true },
  descripcion: String,
  fecha: { type: Date, required: true },
  maxAforo: Number,
  privado: Boolean,
  terminado: Boolean
};
const eventoSchema = new Schema(eventoSchemaDetails, {
  strictQuery: false
});

// create model
const eventoModel = mongoose.model(COLLECTION_NAME, eventoSchema);

module.exports = eventoModel;
