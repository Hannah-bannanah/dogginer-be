const mongoose = require(mongoose);

const Schema = mongoose.Schema;

const COLLECTION_NAME = 'Cliente';

const clienteSchemaDetails = {
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
};

const clienteSchema = new Schema(clienteSchemaDetails);

const clienteModel = mongoose.model(COLLECTION_NAME, clienteSchema);

module.exports = clienteModel;
