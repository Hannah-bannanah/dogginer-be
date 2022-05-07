// import 3rd party modules
const express = require('express');

// import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');

// initialize router
const router = express.Router({ mergeParams: true });

// swagger Mensaje schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Mensaje:
 *       type: object
 *       description: Un mensaje
 *       properties:
 *         destinatario:
 *           type: string
 *           descripcion: username del destinatario
 *         asunto:
 *           type: string
 *           description: asunto del mensaje
 *         mensaje:
 *          type: string
 *          description: el contenido del mensaje
 *       required:
 *        - asunto
 *        - mensaje
 *       example:
 *        destinatario: "Adiestrador1"
 *        asunto: "Solicitud de adiestramiento"
 *        mensaje: "Me gustaría organizar una sesión de adiestramiento para mi perra Mora"
 */

// get clientes
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/clientes:
 *  get:
 *    summary: Obtener lista de clientes registrados en eventos del adiestrador
 *    tags:
 *      - adiestradores
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
 *                  type: object
 *                  properties:
 *                    username:
 *                      type: string
 *                      description: el username del cliente
 */
router.get('', adiestradorController.fetchClientes);

// email cliente
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/clientes/email:
 *  post:
 *    summary: Enviar un email al cliente
 *    descripcion: Envia un email al cliente siempre y cuando el cliente este registrado en al menos un evento organizado por el adiestrador
 *    tags:
 *      - adiestradores
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
 *      422:
 *        $ref: "#/components/responses/InvalidEntryError"
 */
router.post('/email', adiestradorController.emailClient);

// enviar mensaje a clientes
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/clientes/broadcast:
 *  post:
 *    summary: Enviar un email a todos los clientes registrados en eventos del adiestrador
 *    tags:
 *      - adiestradores
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
 *          example:
 *            asunto: "50% de descuento Agility"
 *            mensaje: "Apuntate esta semana a nuestra sesion grupal de entrenamiento de Agility y obten un 50% de descuento"
 *    responses:
 *      201:
 *        description: "success"
 *      422:
 *        $ref: "#/components/responses/InvalidEntryError"
 */
router.post('/broadcast', adiestradorController.sendBroadCast);

module.exports = router;
