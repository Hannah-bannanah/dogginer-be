//import 3rd party modules
const mongoose = require('mongoose');

//import internal modules
const { AUTHORITIES } = require('../util/authorities.config');
//create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'User';

const userSchemaDetails = {
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      AUTHORITIES.CLIENTE,
      AUTHORITIES.ADIESTRADOR,
      AUTHORITIES.GOD,
    ],
    default: AUTHORITIES.CLIENTE,
    required: true,
    immutable: true,
  },
};
const userSchema = new Schema(userSchemaDetails, {
  strictQuery: false,
});

//create model
const userModel = mongoose.model(COLLECTION_NAME, userSchema);

module.exports = userModel;
