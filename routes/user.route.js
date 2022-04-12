//import 3rd party modules
const express = require('express');

//import internal modules
const userController = require('../controllers/user.controller');

//initialize router
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Un usuario
 *       properties:
 *         email:
 *           type: string
 *           description: la direccion de email del user
 *         password:
 *           type: string
 *           description: la password de usuario del user
 *         role:
 *           type: string
 *           description: '"CLIENTE", "ADIESTRADOR", "GOD"'
 *       required:
 *        - email
 *        - password
 *        - role
 *       example:
 *         email: "hannah@bannanah.com"
 *         password: "secreta"
 *         role: "GOD"
 */

// get all
/**
 * @swagger
 * /users:
 *  get:
 *    summary: obtener lista de users
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/User"
 */
router.get('', userController.findAll);

// create one
/**
 * @swagger
 * /users:
 *  post:
 *    summary: crear un nuevo user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: "user creado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  description: userId
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
router.post('', userController.create);

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *    summary: buscar un user por id
 *    description: Devuelve el user, o un objeto vacio si no se ha encontrado
 *    parameters:
 *      - in: path
 *        name: "userId"
 *        description: el id del user
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
 *              $ref: "#/components/schemas/User"
 *
 */
// find by id
router.get('/:userId', userController.findById);

// delete by id
/**
 * @swagger
 * /users/{userId}:
 *  delete:
 *    summary: eliminar un user
 *    parameters:
 *      - in: path
 *        name: "userId"
 *        description: el id del user
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      204:
 *        description: "user eliminado con exito"
 */
router.delete('/:userId', userController.deleteById);

/**
 * @swagger
 * /users/{userId}:
 *  patch:
 *    summary: actualizar un user
 *    description: El user se actualizará con los campos incluidos en el responseBody
 *    parameters:
 *      - in: path
 *        name: "userId"
 *        description: el id del user
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: "User actualizado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: "User no encontrado"
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
router.patch('/:userId', userController.update);

module.exports = router;
