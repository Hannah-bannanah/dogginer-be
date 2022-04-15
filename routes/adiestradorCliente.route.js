// import 3rd party modules
const express = require('express');

// import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');

// initialize router
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * components:
 *   schemas:
 *     Mensaje:
 *       type: object
 *       description: Un mensaje
 *       properties:
 *         asunto:
 *           type: string
 *           description: asunto del mensaje
 *         contenido:
 *          type: string
 *          description: el contenido del mensaje
 *       required:
 *        - asunto
 *       example:
 *        asunto: "Descuento"
 *        mensaje: "Usa el cupon HannahRulez para obtener un 99% de descuento en tu proximo evento"
 */

// get clientes
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/clientes:
 *  get:
 *    summary: obtener lista de clientes registrados en eventos del adiestrador
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        schema:
 *          type: string
 *        required: true
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Cliente"
 */
router.get('', adiestradorController.fetchClientes);

// enviar mensaje a clientes
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/clientes/broadcast:
 *  post:
 *    summary: obtener lista de clientes registrados en eventos del adiestrador
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        schema:
 *          type: string
 *        required: true
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: "#/components/schemas/Mensaje"
 *    responses:
 *      201:
 *        description: "success"
 */
router.get('', adiestradorController.sendBroadCast);

module.exports = router;
