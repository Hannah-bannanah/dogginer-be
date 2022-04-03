//import 3rd party modules
const mongoose = require('mongoose');

//create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Adiestrador';

const adiestradorSchemaDetails = {
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  perfilId: {
    type: Schema.Types.ObjectId,
    ref: 'Perfil',
  },
};

const adiestradorSchema = new Schema(adiestradorSchemaDetails);

//create model
const adiestradorModel = mongoose.model(
  COLLECTION_NAME,
  adiestradorSchema
);

module.exports = adiestradorModel;
