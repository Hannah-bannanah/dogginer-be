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
/**
 * @swagger
 * components:
 *   schemas:
 *     Adiestrador:
 *       type: object
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

// get all
/**
 * @swagger
 * /adiestradores:
 *  get:
 *    summary: obtener lista de adiestradores
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Adiestrador"
 */
router.get('', (req, res, next) => {
  adiestradorController.findAll(req, res, next);
});

// create one
/**
 * @swagger
 * /adiestradores:
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
 *        description: "adiestrador creado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  description: idAdiestrador
 *                  type: string
 *      400:
 *        description: "Entrada duplicada"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errorMessage:
 *                  description: error
 *                  type: string
 *      422:
 *        description: "información inválida"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errorMessage:
 *                  description: error
 *                  type: string
 */
router.post('', (req, res, next) => {
  adiestradorController.createAdiestrador(req, res, next);
});

/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  get:
 *    summary: buscar un adiestrador por id
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: "#/components/schemas/Adiestrador"
 *
 */
// find by id
router.get('/:idAdiestrador', (req, res, next) => {
  adiestradorController.findById(req, res, next);
});

// // find by email
// router.get('/buscar/email/:email', (req, res, next) => {
//   adiestradorController.findByEmail(req, res, next);
// });

// delete by id
/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  delete:
 *    summary: eliminar un adiestrador
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: "adiestrador eliminado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: "#/components/schemas/Adiestrador"
 */
router.delete('/:idAdiestrador', (req, res, next) => {
  adiestradorController.deleteById(req, res, next);
});

/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  patch:
 *    summary: actualizar un adiestrador
 *    description: El adiestrador se actualizará con los campos incluidos en el responseBody
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: el email del adiestrador
 *              password:
 *                type: string
 *                description: la password del adiestrador
 *    responses:
 *      200:
 *        description: "adiestrador actualizado con exito"
 *      404:
 *        description: "adiestrador no encontrado"
 *      422:
 *        description: "información inválida"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                errorMessage:
 *                  description: error
 *                  type: string
 */
router.patch('/:idAdiestrador', (req, res, next) => {
  adiestradorController.update(req, res, next);
});

module.exports = router;
