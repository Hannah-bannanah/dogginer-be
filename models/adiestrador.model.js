const mongoose = require(mongoose);

const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Adiestrador';

const adiestradorSchemaDetails = {
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
};

const adiestradorSchema = new Schema(adiestradorSchemaDetails);

const adiestradorModel = mongoose.model(
  COLLECTION_NAME,
  adiestradorSchema
);

module.exports = adiestradorModel;
