//import 3rd party modules
const express = require('express');

//import internal modules
const perfilController = require('../controllers/perfil.controller');

//initialize router
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Perfil:
 *      type: object
 *      description: El perfil publico de un adiestrador
 *      properties:
 *        idAdiestrador:
 *          type: string
 *          description: el id del adiestrador
 *        precio:
 *          type: number
 *          description: el precio por sesion
 *        contacto:
 *          type: string
 *          description: el numero de telefono o email de contacto
 *      required:
 *       - idAdiestrador
 *       - precio
 *       - contacto
 */

// get all
/**
 * @swagger
 * /perfiles:
 *  get:
 *    summary: obtener lista de perfiles de adiestradores
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Perfil"
 */
router.get('', perfilController.findAll);

module.exports = router;
