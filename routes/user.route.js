// import 3rd party modules
const express = require('express');

// import internal modules
const userController = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth');

// initialize router
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Un usuario
 *       properties:
 *         _id:
 *           type: string
 *           description: id del user
 *         email:
 *           type: string
 *           description: la direccion de email del user
 *         role:
 *           type: string
 *           description: '"CLIENTE", "ADIESTRADOR", "GOD"'
 *       example:
 *         _id: "625559613d9f4a9c59441033"
 *         email: "hannah@bannanah.com"
 *         role: "GOD"
 */

// get all
/**
 * @swagger
 * /users:
 *  get:
 *    summary: obtener lista de users
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
 *                $ref: "#/components/schemas/User"
 */
router.get('', isAuthenticated, userController.findAll);

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
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              role:
 *                type: string
 *                description: '"CLIENTE", "ADIESTRADOR", "GOD"'
 *            required:
 *              - email
 *              - password
 *              - role
 *            example:
 *              email: "hannah@bannanah.com"
 *              password: "secreta"
 *              role: "GOD"
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
 *        $ref: "#/components/responses/DuplicateEntryError"
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.post('', userController.create);

// login
/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: generar token de login
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                description: el email del usuario
 *              password:
 *                type: string
 *                format: password
 *                description: la password del usuario
 *            required:
 *             - email
 *             - password
 *            example:
 *              email: "hannah@bannanah.com"
 *              password: "secreta"
 *    responses:
 *      200:
 *        description: "login procesado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  description: crsf token
 *                  type: string
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 */
router.post('/login', userController.generateToken);

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *    summary: buscar un user por id
 *    security:
 *      - bearerAuth: []
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
router.get('/:userId', isAuthenticated, userController.findById);

// delete by id
/**
 * @swagger
 * /users/{userId}:
 *  delete:
 *    summary: eliminar un user
 *    security:
 *      - bearerAuth: []
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
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 */
router.delete('/:userId', isAuthenticated, userController.deleteById);

/**
 * @swagger
 * /users/{userId}:
 *  patch:
 *    summary: actualizar un user
 *    security:
 *      - bearerAuth: []
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
 *            properties:
 *              email:
 *                type: string
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
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.patch('/:userId', isAuthenticated, userController.update);

module.exports = router;
