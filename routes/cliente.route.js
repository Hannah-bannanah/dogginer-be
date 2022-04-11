//import 3rd party modules
const express = require('express');

//import internal modules
const clienteController = require('../controllers/cliente.controller');

//initialize router
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       description: Un cliente
 *       properties:
 *         email:
 *           type: string
 *           description: la direccion de email del cliente
 *         password:
 *           type: string
 *           description: la password de usuario del cliente
 *       required:
 *        - email
 *        - password
 *       example:
 *         email: "hannah@bannanah.com"
 *         password: "secreta"
 */

// get all
/**
 * @swagger
 * /clientes:
 *  get:
 *    summary: obtener lista de clientes
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
router.get('', clienteController.findAll);

// create one
/**
 * @swagger
 * /clientes:
 *  post:
 *    summary: crear un nuevo cliente
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
 *      400:
 *        description: "Entrada duplicada"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  description: error
 *                  type: string
 *      422:
 *        description: "Información inválida"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  description: error
 *                  type: string
 */
router.post('', clienteController.create);

/**
 * @swagger
 * /clientes/{idCliente}:
 *  get:
 *    summary: buscar un cliente por id
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
// find by id
router.get('/:idCliente', clienteController.findById);

// delete by id
/**
 * @swagger
 * /clientes/{idCliente}:
 *  delete:
 *    summary: eliminar un cliente
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
router.delete('/:idCliente', clienteController.deleteById);

/**
 * @swagger
 * /clientes/{idCliente}:
 *  patch:
 *    summary: actualizar un cliente
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
 *            properties:
 *              email:
 *                type: string
 *                description: el email del cliente
 *              password:
 *                type: string
 *                description: la password del cliente
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
 *        description: "información inválida"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  description: error
 *                  type: string
 */
router.patch('/:idCliente', clienteController.update);

module.exports = router;
