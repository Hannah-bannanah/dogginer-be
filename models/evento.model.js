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
  imageUrl: { type: String, default: 'https://picsum.photos/id/357/300' },
  invitados: {
    type: [
      {
        idCliente: {
          type: Schema.Types.ObjectId,
          ref: 'Cliente'
        }
      }
    ]
  }
};
const eventoSchema = new Schema(eventoSchemaDetails, {
  strictQuery: false
});

eventoSchema.virtual('terminado').get(function () {
  return this.fecha < Date.now();
});
eventoSchema.virtual('privado').get(function () {
  return this.invitados && this.invitados.length > 0;
});

eventoSchema.set('toObject', { virtuals: true });

// create model
const eventoModel = mongoose.model(COLLECTION_NAME, eventoSchema);

module.exports = eventoModel;
