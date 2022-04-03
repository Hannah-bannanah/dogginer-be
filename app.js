//import third party modules
const express = require('express');
const mongoose = require('mongoose');

//import internal modules
const { DBCONNECTION } = require('./util/db.config');

//import routes
const adiestradorRouter = require('./routes/adiestrador.route');

//create app
const app = express();

// app.use(router);
app.use(express.json()); //parser de json
app.use(express.urlencoded({ extended: true })); //parser de objetos url.

//define routers
app.use('/adiestrador', adiestradorRouter);

mongoose
  .connect(DBCONNECTION)
  .then(() => {
    console.log('DB connected!');
    app.listen(3000);
  })
  .catch(err => console.log(err));
