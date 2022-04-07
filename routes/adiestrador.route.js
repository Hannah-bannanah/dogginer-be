//import 3rd party modules
const express = require('express');
//import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');

//initialize router
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Adiestrador:
 *       type: object
 *       description: Un adiestrador
 *       properties:
 *         email:
 *           type: string
 *           description: la direccion de email del adiestrador
 *         password:
 *           type: string
 *           description: la password de usuario del adiestrador
 *         profileId:
 *           type: integer
 *           description: el id del perfil publico del adiestrador
 *       required:
 *        - email
 *        - password
 *       example:
 *         email: "hannah@bannanah.com"
 *         password: "secreta"
 *         profileId: 1
 */

// define routes

// get all
/**
 * @swagger
 * /adiestradores:
 *  get:
 *    summary: obtener todos los adiestradores
 *    responses:
 *      200:
 *        description: success
 */
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
/**
 * @swagger
 * /adiestradores/create:
 *  post:
 *    summary: crear un nuevo adiestrador
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Adiestrador'
 *    responses:
 *      201:
 *        description: nuevo adiestrador creado con exito
 */
router.post('/create', (req, res, next) => {
  adiestradorController.createAdiestrador(req, res, next);
});

// delete by id
router.delete('/:idAdiestrador', (req, res, next) => {
  adiestradorController.deleteById(req, res, next);
});

module.exports = router;
