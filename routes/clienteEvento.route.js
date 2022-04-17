// import 3rd party modules
const express = require('express');

// import internal modules
const clienteController = require('../controllers/cliente.controller');

// initialize router
const router = express.Router();

// get eventos
/**
 * @swagger
 * /clientes/{idCliente}/eventos:
 *  get:
 *    summary: obtener lista de eventos en los que esta registrado un cliente
 *    tags:
 *      - clientes
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: "idCliente"
 *        description: el id del cliente
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Evento"
 *      403:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      404:
 *        $ref: "#/components/responses/ElementNotFoundError"
 */
router.get('', clienteController.fetchEventos);

// get eventos
/**
 * @swagger
 * /clientes/{idCliente}/eventos:
 *  patch:
 *    summary: registrarse para un evento
 *    tags:
 *      - clientes
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: "idCliente"
 *        description: el id del cliente
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
 *              idEvento:
 *                type: string
 *                description: el id del evento
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Evento"
 *      403:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      404:
 *        $ref: "#/components/responses/ElementNotFoundError"
 *      422:
 *        $ref: "#/components/responses/InvalidEntryError"
 */
router.patch('', clienteController.addEvento);

// get evento
/**
 * @swagger
 * /clientes/{idCliente}/eventos/{idEvento}:
 *  get:
 *    summary: obtener los detalles de un evento en el que esta registrado un cliente
 *    tags:
 *      - clientes
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del cliente
 *        required: true
 *      - in: path
 *        name: "idEvento"
 *        description: el id del evento
 *        required: true
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: "#/components/schemas/Evento"
 *      403:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      404:
 *        $ref: '#/components/responses/ElementNotFoundError'
 */
router.get('/:idEvento', clienteController.getEvento);

// delete evento
/**
 * @swagger
 * /clientes/{idCliente}/eventos/{idEvento}:
 *  delete:
 *    summary: cancelar la asistencia a un evento
 *    tags:
 *      - clientes
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: "idCliente"
 *        description: el id del cliente
 *        required: true
 *      - in: path
 *        name: "idEvento"
 *        description: el id del evento
 *        schema:
 *        required: true
 *    responses:
 *      200:
 *        description: "cancelacion procesada con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Evento"
 *      403:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      404:
 *        $ref: '#/components/responses/ElementNotFoundError'
 */
router.delete('/:idEvento', clienteController.cancelarEvento);

module.exports = router;
