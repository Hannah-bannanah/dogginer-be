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
const clienteRouter = require('./routes/cliente.route');
const perfilRouter = require('./routes/perfil.route');

const { errorHandler } = require('./middleware/error.handler');

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
app.use('/clientes', clienteRouter);
app.use('/perfiles', perfilRouter);

// error handling
app.use(errorHandler);

mongoose
  .connect(DBCONNECTION)
  .then(() => {
    console.log('DB connected!');
    app.listen(3000);
  })
  .catch(err => console.log(err));
