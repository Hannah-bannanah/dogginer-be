//import 3rd party modules
const express = require('express');
//import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');

//initialize router
const router = express.Router();

// define routes

// get all
router.get('', (req, res, next) => {
  adiestradorController.findAll(req, res, next);
});

// find by id
router.get('/:idAdiestrador', (req, res, next) => {
  adiestradorController.findById(req, res, next);
});

// // find by email
// router.get('/buscar/email/:email', (req, res, next) => {
//   adiestradorController.findByEmail(req, res, next);
// });

// create one
router.post('/create', (req, res, next) => {
  adiestradorController.createAdiestrador(req, res, next);
});

// delete by id
router.delete('/:idAdiestrador', (req, res, next) => {
  adiestradorController.deleteById(req, res, next);
});

module.exports = router;
