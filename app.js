// import third party modules
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');

// import internal modules
const { DBCONNECTION } = require('./util/db.config');
const { SWAGGERSPEC } = require('./util/swagger.config');

// import routes
const userRouter = require('./routes/user.route');
const clienteRouter = require('./routes/cliente.route');
const adiestradorRouter = require('./routes/adiestrador.route');
const eventoRouter = require('./routes/evento.route');
const inicializarRouter = require('./routes/inicializar.route');

const { errorHandler } = require('./middleware/error.handler');

// create app
const app = express();

// middleware
app.use(express.json()); // parser de json
app.use(express.urlencoded({ extended: true })); // parser de objetos url.
app.use(
  '/swagger',
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(SWAGGERSPEC))
);

// const options = {
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// };
app.use(cors());

// define routers
app.use('/users', userRouter);
app.use('/clientes', clienteRouter);
app.use('/adiestradores', adiestradorRouter);
app.use('/eventos', eventoRouter);
app.use('/inicializar', inicializarRouter);

// error handling
app.use(errorHandler);
mongoose
  .connect(DBCONNECTION)
  .then(() => {
    console.log('DB connected!');
    app.listen(3000);
    // app.listen(80);
  })
  .catch((err) => console.log(err));
