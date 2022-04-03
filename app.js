//import third party modules
const express = require('express');

//import internal modules
const { DBCONNECTION } = require('./util/db.config');

//create app
const app = express();
// const router = express.Router();

// app.use(router);
app.use(express.json()); //parser de json
app.use(express.urlencoded({ extended: true })); //parser de objetos url.

const server = app.listen(3000);
