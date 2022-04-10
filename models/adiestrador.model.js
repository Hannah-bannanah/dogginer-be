//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules
const Perfil = require('../models/perfil.model');

//create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Adiestrador';

const adiestradorSchemaDetails = {
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  idPerfil: {
    type: Schema.Types.ObjectId,
    ref: 'Perfil',
    immutable: true,
  },
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
