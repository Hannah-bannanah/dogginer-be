// import 3rd party modules
const mongoose = require('mongoose');

// import internal modules

// create schema ,.
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Adiestrador';
const TAGS = ['Agility', 'Cachorros', 'Razas grandes', 'Pastoreo'];

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
  tags: [{ type: String, enum: TAGS }],
  _ratings: [
    {
      idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
      },
      score: { type: Number, required: true }
    }
  ],
  rating: { type: Number, default: calculateRating(this._ratings) }
};

const adiestradorSchema = new Schema(adiestradorSchemaDetails, {
  strictQuery: false
});

adiestradorSchema.pre('save', function () {
  if (this._ratings && this._ratings.length) {
    this.rating = calculateRating(this._ratings);
  }
});

// eslint-disable-next-line space-before-function-paren
function calculateRating(ratings) {
  if (!ratings || !ratings.length) return null;
  return (
    ratings.map((r) => r.score).reduce((sum, val) => sum + val) / ratings.length
  );
}

// create model
const adiestradorModel = mongoose.model(COLLECTION_NAME, adiestradorSchema);

module.exports = adiestradorModel;
