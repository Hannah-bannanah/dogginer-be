//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules

//create schema ,.
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Adiestrador';

const adiestradorSchemaDetails = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
    unique: true,
  },
  nombre: { type: String, required: true },
  bio: String,
  eventos: [
    {
      idEvento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
      },
    },
  ],
  rating: [
    {
      idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true,
      },
      score: { type: Number, required: true },
    },
  ],
};

const adiestradorSchema = new Schema(adiestradorSchemaDetails, {
  strictQuery: false,
});

adiestradorSchema.pre('save', async function () {
  if (this.isNew) {
    const perfil = new Perfil({
      idAdiestrador: this._id,
    });
    await perfil.save();
    this.idPerfil = perfil._id;
  }
});

//create model
const adiestradorModel = mongoose.model(
  COLLECTION_NAME,
  adiestradorSchema
);

module.exports = adiestradorModel;
