// import 3rd party modules
const express = require('express');

// import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');
const { verifyAdiestrador } = require('../middleware/auth');

// initialize router
const router = express.Router({ mergeParams: true });

// get eventos
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/eventos:
 *  get:
 *    summary: obtener lista de eventos del adiestrador
 *    tags:
 *      - adiestradores
 *    security:
 *      - bearerAuth: []
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
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Evento"
 *      404:
 *        $ref: "#/components/responses/ElementNotFoundError"
 */
router.get('', adiestradorController.fetchEventos);

// create one
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/eventos:
 *  post:
 *    summary: crear un nuevo evento
 *    tags:
 *      - adiestradores
 *    security:
 *      - bearerAuth: []
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
 *            $ref: '#/components/schemas/Evento'
 *    responses:
 *      200:
 *        description: "evento creado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  description: idEvento
 *                  type: string
 *      409:
 *        $ref: "#/components/responses/DuplicateEntryError"
 *      403:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.post('', verifyAdiestrador, adiestradorController.createEvento);

// update evento
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/eventos/{idEvento}:
 *  patch:
 *    summary: actualizar un evento
 *    tags:
 *      - adiestradores
 *    security:
 *      - bearerAuth: []
 *    description: El evento se actualizará con los campos incluidos en el responseBody
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        required: true
 *      - in: path
 *        name: "idEvento"
 *        description: el id del evento
 *        schema:
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Evento'
 *    responses:
 *      200:
 *        description: "Evento actualizado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Evento'
 *      403:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      404:
 *        $ref: '#/components/responses/ElementNotFoundError'
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.patch(
  '/:idEvento',
  verifyAdiestrador,
  adiestradorController.updateEvento
);

// delete evento
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/eventos/{idEvento}:
 *  delete:
 *    summary: eliminar un evento
 *    tags:
 *      - adiestradores
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        required: true
 *      - in: path
 *        name: "idEvento"
 *        description: el id del evento
 *        schema:
 *        required: true
 *    responses:
 *      204:
 *        description: "evento eliminado con exito"
 *      403:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      404:
 *        $ref: '#/components/responses/ElementNotFoundError'
 */
router.delete(
  '/:idEvento',
  verifyAdiestrador,
  adiestradorController.deleteEvento
);

module.exports = router;
