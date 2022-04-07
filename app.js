//import third party modules
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

//import internal modules
const { DBCONNECTION } = require('./util/db.config');
const { SWAGGERSPEC } = require('./util/swagger.config');

//import routes
const adiestradorRouter = require('./routes/adiestrador.route');

//create app
const app = express();

// middleware
app.use(express.json()); //parser de json
app.use(express.urlencoded({ extended: true })); //parser de objetos url.
app.use(
  '/swagger',
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(SWAGGERSPEC))
);

// define routers
app.use('/adiestradores', adiestradorRouter);

app.listen(3000);

mongoose
  .connect(DBCONNECTION)
  .then(() => {
    console.log('DB connected!');
    app.listen(3000);
  })
  .catch(err => console.log(err));
