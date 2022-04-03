//import 3rd party modules
const express = require('express');
//import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');

//initialize router
const router = express.Router();

//define routes
router.post('/create', (req, res, next) => {
  adiestradorController.createAdiestrador(req, res, next);
});

module.exports = router;
