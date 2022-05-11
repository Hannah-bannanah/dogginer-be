// import 3rd party modules
const express = require('express');

// import internal modules
const userController = require('../controllers/user.controller');
const { isGod } = require('../middleware/auth');

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
 *         username:
 *           type: string
 *           description: username del user
 *         email:
 *           type: string
 *           description: la direccion de email del user
 *         role:
 *           type: string
 *           description: '"CLIENTE", "ADIESTRADOR", "GOD"'
 *       example:
 *         _id: "625559613d9f4a9c59441033"
 *         username: "Cliente1"
 *         email: "cliente1@dogginer.com"
 *         role: "CLIENTE"
 */

// get all
/**
 * @swagger
 * /users:
 *  get:
 *    summary: Obtener lista de users
 *    tags:
 *      - users
 *    description: Ruta reservada para administradores
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
router.get('', isGod, userController.findAll);

// create one
/**
 * @swagger
 * /users:
 *  post:
 *    summary: Crear un nuevo user
 *    descripcion: Crea un nuevo usuario en caso de que el email y username no existan en la BD. Si no se especifica el username, cogera por defecto el valor del email
 *    tags:
 *      - users
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
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
 *    summary: Generar token de login
 *    description: Al introducir un email y password valido,
 *      devuelve un token de autenticacion, el tiempo de validez, el id de usuario, su rol y su id de adiestrador o de cliente
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
 *              email: "cliente1@dogginer.com"
 *              password: "Test1234"
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
 *                role:
 *                  description: rol del usuario
 *                  type: string
 *                idAdiestrador:
 *                  description: el idAdiestrador del usuario en caso de ser adiestrador
 *                  type: string
 *                idCliente:
 *                  description: el idCliente del usuario en caso de ser cliente
 *                  type: string
 *              required:
 *               - token
 *               - validity
 *               - userId
 *               - role
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 */
router.post('/login', userController.generateLoginToken);

// find by Id
/**
 * @swagger
 * /users/{userId}:
 *  get:
 *    summary: Buscar un user por id
 *    tags:
 *      - users
 *    description: Ruta reservada para administradores
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
router.get('/:userId', isGod, userController.findById);

// delete by id
/**
 * @swagger
 * /users/{userId}:
 *  delete:
 *    summary: Eliminar un user
 *    tags:
 *      - users
 *    description: Ruta reservada para administradores
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
router.delete('/:userId', isGod, userController.deleteById);

// update
/**
 * @swagger
 * /users/{userId}:
 *  patch:
 *    summary: Actualizar un user
 *    tags:
 *      - users
 *    description: Ruta reservada para administradores. Los unicos campos actualizables por este endpoint son el email y el username
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
 *              username:
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
router.post('/:userId', isGod, userController.update);

// get password reset token
/**
 * @swagger
 * /users/resetPassword:
 *  patch:
 *    summary: Generar token y enviar email al usuario
 *    description: El usuario recibirá un email con un link que incluirá un
 *                 token generado aleatoriamente.
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
 *    responses:
 *      202:
 *        description: "User actualizado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                message:
 *                  type: string
 *            example:
 *              success: true
 *              message: "link para el reseteo enviado a cliente1@dogginer.com"
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
router.patch('/resetPassword', userController.generateResetToken);

// update password
/**
 * @swagger
 * /users/{userId}/resetPassword/{token}:
 *  patch:
 *    summary: Actualizar la password de un user
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
