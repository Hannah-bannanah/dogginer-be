// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules

// create schema ,.
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Adiestrador';

const adiestradorSchemaDetails = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
    unique: true
  },
  nombre: { type: String, required: true },
  bio: String,
  imageUrl: { type: String, default: 'https://picsum.photos/id/237/300' },
  eventos: [
    {
      idEvento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento'
      }
    }
  ],
  _ratings: [
    {
      idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
      },
      score: { type: Number, required: true }
    }
  ]
};

const adiestradorSchema = new Schema(adiestradorSchemaDetails, {
  strictQuery: false
});

adiestradorSchema.virtual('rating').get(function () {
  if (!this._ratings.length) return null;
  return (
    this._ratings.map((r) => r.score).reduce((sum, val) => sum + val) /
    this._ratings.length
  );
});

adiestradorSchema.set('toObject', { virtuals: true });

// create model
const adiestradorModel = mongoose.model(COLLECTION_NAME, adiestradorSchema);

module.exports = adiestradorModel;
