// import 3rd party modules
const express = require('express');

// import internal modules
const userController = require('../controllers/user.controller');
// const { isAuthenticated } = require('../middleware/auth');

// initialize router
const router = express.Router();

// swagger schema
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
 *         role: "CLIENTE"
 */

// get all
/**
 * swagger
 * /users:
 *  get:
 *    summary: obtener lista de users
 *    tags:
 *      - GOD
 *    description: ruta reservada para administradores
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
// router.get('', userController.findAll);

// create one
/**
 * @swagger
 * /users:
 *  post:
 *    summary: crear un nuevo user
 *    tags:
 *      - users
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
 *      409:
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
 *    tags:
 *      - users
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
 *                  description: jwt token
 *                  type: string
 *                validity:
 *                  description: validez del token en segundos
 *                  type: number
 *                userId:
 *                  description: id del usuario
 *                  type: string
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 */
router.post('/login', userController.generateLoginToken);

/**
 * swagger
 * /users/{userId}:
 *  get:
 *    summary: buscar un user por id
 *    tags:
 *      - GOD
 *    description: ruta reservada para administradores
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
// router.get('/:userId', isAuthenticated, userController.findById);

// delete by id
/**
 * swagger
 * /users/{userId}:
 *  delete:
 *    summary: eliminar un user
 *    tags:
 *      - GOD
 *    description: ruta reservada para administradores
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
// router.delete('/:userId', isGod, userController.deleteById);

// update
/**
 * swagger
 * /users/{userId}:
 *  patch:
 *    summary: actualizar un user
 *    tags:
 *      - GOD
 *    description: ruta reservada para administradores
 *    security:
 *      - bearerAuth: []
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
// router.patch('/:userId', isGod, userController.update);

// get password reset token
/**
 * @swagger
 * /users/{userId}/resetPassword:
 *  patch:
 *    summary: generar token y enviar email al usuario
 *    description: El usuario recibirá un email con un link que incluirá un
 *                 token generado aleatoriamente. Accediendo a ese link podrá cambiar la password
 *    tags:
 *      - users
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
 *          required:
 *            - email
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
 */
router.patch('/:userId/resetPassword', userController.generateResetToken);

// update password
/**
 * @swagger
 * /users/{userId}/resetPassword/{token}:
 *  patch:
 *    summary: actualizar la password de un user
 *    tags:
 *      - users
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: "userId"
 *        description: el id del user
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: "token"
 *        description: el token enviado por email
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newPassword:
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
 */
router.patch('/:userId/resetPassword/:token', userController.resetPassword);

module.exports = router;
