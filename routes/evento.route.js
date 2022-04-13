// import 3rd party modules
const express = require('express');

// import internal modules
const eventoController = require('../controllers/evento.controller');
const { isAuthenticated } = require('../middleware/auth');

// initialize router
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       description: Un evento
 *       properties:
 *         idAdiestrador:
 *           type: string
 *           description: el id del adiestrador creador del evento
 *         nombre:
 *           type: string
 *           description: el nombre del evento
 *         descripcion:
 *           type: string
 *           description: la descripcion del evento
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: la fecha en que tiene lugar el evento
 *         maxAforo:
 *           type: number
 *           descripcion: el aforo maximo del evento
 *         privado:
 *           type: boolean
 *           descripcion: indicador de si el evento es privado (omitir si no lo es)
 *         terminado:
 *           type: boolean
 *           descripcion: indicador de si el evento ha terminado (omitir si no es asi)
 *       required:
 *        - nombre
 *        - idAdiestrador
 *        - fecha
 *       example:
 *         nombre: "Sesion de adiestramiento"
 *         descripcion: "Adiestramiento de agility de Mora"
 *         idAdiestrador: "6249701119292623c38f0c11"
 *         fecha: "2017-07-21T17:32:28Z"
 *         maxAforo: 27
 *         privado: true
 *
 */

// get all
/**
 * @swagger
 * /eventos:
 *  get:
 *    summary: obtener lista de eventos
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Evento"
 */
router.get('', eventoController.findAll);

// create one
/**
 * @swagger
 * /eventos:
 *  post:
 *    summary: crear un nuevo evento
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
 *      400:
 *        $ref: "#/components/responses/DuplicateEntryError"
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.post('', eventoController.create);

/**
 * @swagger
 * /eventos/{idEvento}:
 *  get:
 *    summary: buscar un evento por id
 *    description: Devuelve el evento, o un objeto vacio si no se ha encontrado
 *    parameters:
 *      - in: path
 *        name: "idEvento"
 *        description: el id del evento
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
 *              $ref: "#/components/schemas/Evento"
 *
 */
// find by id
router.get('/:idEvento', eventoController.findById);

// delete by id
/**
 * @swagger
 * /eventos/{idEvento}:
 *  delete:
 *    summary: eliminar un evento
 *    parameters:
 *      - in: path
 *        name: "idEvento"
 *        description: el id del evento
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      204:
 *        description: "evento eliminado con exito"
 */
router.delete('/:idEvento', isAuthenticated, eventoController.deleteById);

/**
 * @swagger
 * /eventos/{idEvento}:
 *  patch:
 *    summary: actualizar un evento
 *    description: El evento se actualizará con los campos incluidos en el responseBody
 *    parameters:
 *      - in: path
 *        name: "idEvento"
 *        description: el id del evento
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
 *        description: "Evento actualizado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Evento'
 *      404:
 *        description: "Evento no encontrado"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  description: error
 *                  type: string
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.patch('/:idEvento', isAuthenticated, eventoController.update);

module.exports = router;
