// import 3rd party modules
const express = require('express');

// import internal modules
const clienteController = require('../controllers/cliente.controller');
const clienteEventosRouter = require('../routes/clienteEvento.route');
const { isAuthenticated, verifyCliente, isGod } = require('../middleware/auth');

// initialize router
const router = express.Router();

// definir subrutas
router.use('/:idCliente/eventos', verifyCliente, clienteEventosRouter);

// swagger Cliente schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       description: Un cliente
 *       properties:
 *         userId:
 *          type: string
 *          description: el id de usuario
 *         nombre:
 *           type: string
 *           description: El nombre del cliente
 *         eventos:
 *           type: array
 *           items:
 *            type: object
 *            $ref: '#/components/schemas/Evento'
 *       required:
 *        - userId
 *        - nombre
 *       example:
 *         userId: "6249701119292623c38f0c11"
 *         nombre: "Jane Doe"
 *
 */

// get all
/**
 * swagger
 * /clientes:
 *  get:
 *    summary: obtener lista de clientes
 *    tags:
 *      - GOD
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
// router.get('', isGod, clienteController.findAll);

// create one
/**
 * @swagger
 * /clientes:
 *  post:
 *    summary: crear un nuevo cliente
 *    tags:
 *      - clientes
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Cliente'
 *    responses:
 *      200:
 *        description: "cliente creado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  description: idCliente
 *                  type: string
 *      409:
 *        $ref: "#/components/responses/DuplicateEntryError"
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.post('', clienteController.create);

// get one
/**
 * @swagger
 * /clientes/{idCliente}:
 *  get:
 *    summary: buscar un cliente por id
 *    tags:
 *      - clientes
 *    security:
 *      - bearerAuth: []
 *    description: Devuelve el cliente, o un objeto vacio si no se ha encontrado
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
 *              type: object
 *              $ref: "#/components/schemas/Cliente"
 *
 */
router.get('/:idCliente', isAuthenticated, clienteController.findById);

// delete by id
/**
 * @swagger
 * /clientes/{idCliente}:
 *  delete:
 *    summary: eliminar un cliente
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
 *      204:
 *        description: "cliente eliminado con exito"
 */
router.delete('/:idCliente', isAuthenticated, clienteController.deleteById);

// update
/**
 * @swagger
 * /clientes/{idCliente}:
 *  patch:
 *    summary: actualizar un cliente
 *    tags:
 *      - clientes
 *    security:
 *      - bearerAuth: []
 *    description: El cliente se actualizará con los campos incluidos en el responseBody
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
 *            $ref: '#/components/schemas/Cliente'
 *    responses:
 *      200:
 *        description: "Cliente actualizado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Cliente'
 *      404:
 *        description: "Cliente no encontrado"
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
router.patch('/:idCliente', isAuthenticated, clienteController.update);

// email cliente
/**
 * @swagger
 * /clientes/{idCliente}/adiestradores/{idAdiestrador}/email:
 *  post:
 *    summary: Enviar un email al adiestrador
 *    tags:
 *      - clientes
 *    parameters:
 *      - in: path
 *        name: "idCliente"
 *        description: el id del cliente
 *        schema:
 *          type: string
 *        required: true
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
router.post(
  '/:idCliente/adiestradores/:idAdiestrador/email',
  verifyCliente,
  clienteController.emailAdiestrador
);

module.exports = router;
