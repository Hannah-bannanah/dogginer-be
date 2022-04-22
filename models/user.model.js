// import 3rd party modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// import internal modules
const { AUTHORITIES } = require('../util/auth.config');
// create schema
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'User';

const userSchemaDetails = {
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
    // validate: {
    //   validator: function (v) {
    //     // regex obtenida de https://regexlib.com/REDetails.aspx?regexp_id=2558
    //     const regex =
    //       /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
    //     return regex.test(v);
    //   }
    // }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [AUTHORITIES.CLIENTE, AUTHORITIES.ADIESTRADOR, AUTHORITIES.GOD],
    default: AUTHORITIES.CLIENTE,
    required: true,
    immutable: true
  },
  tempResetToken: String,
  tokenValidity: Number
};
const userSchema = new Schema(userSchemaDetails, {
  strictQuery: false
});

// create model
const userModel = mongoose.model(COLLECTION_NAME, userSchema);

module.exports = userModel;
