// import 3rd party modules
const express = require('express');

// import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');
const adiestradorClientesRouter = require('../routes/adiestradorCliente.route');
const adiestradorEventosRouter = require('../routes/adiestradorEvento.route');
const { isAuthenticated, verifyAdiestrador } = require('../middleware/auth');

// initialize router
const router = express.Router();

// defnir subrutas
router.use(
  '/:idAdiestrador/clientes',
  verifyAdiestrador,
  adiestradorClientesRouter
);
router.use('/:idAdiestrador/eventos', adiestradorEventosRouter);

/**
 * @swagger
 * components:
 *   schemas:
 *     Adiestrador:
 *       type: object
 *       description: Un adiestrador
 *       properties:
 *         _id:
 *           type: string
 *           description: el id del adiestrador
 *         userId:
 *          type: string
 *          description: el id de usuario
 *         nombre:
 *           type: string
 *           description: El nombre del adiestrador
 *         bio:
 *           type: string
 *           description: la bio del adiestrador
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
 *         nombre: "John Doe"
 *         bio: "El mejor adiestrador de la zona"
 */

// define routes

// get all
/**
 * @swagger
 * /adiestradores:
 *  get:
 *    summary: obtener lista de adiestradores
 *    responses:
 *      200:
 *        description: "success"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Adiestrador"
 */
router.get('', adiestradorController.findAll);

// create one
/**
 * @swagger
 * /adiestradores:
 *  post:
 *    summary: crear un nuevo adiestrador
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Adiestrador'
 *    responses:
 *      200:
 *        description: "adiestrador creado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  description: idAdiestrador
 *                  type: string
 *      409:
 *        $ref: "#/components/responses/DuplicateEntryError"
 *      422:
 *        $ref: "#/components/responses/InvalidEntryError"
 */
router.post('', adiestradorController.create);

/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  get:
 *    summary: buscar un adiestrador por id
 *    description: Devuelve el adiestrador, o un objeto vacio si no se ha encontrado
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
 *              type: object
 *              $ref: "#/components/schemas/Adiestrador"
 *
 */
// find by id
router.get('/:idAdiestrador', adiestradorController.findById);

// delete by id
/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  delete:
 *    summary: eliminar un adiestrador
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
 *      204:
 *        description: "adiestrador eliminado con exito"
 */
router.delete(
  '/:idAdiestrador',
  isAuthenticated,
  adiestradorController.deleteById
);

/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  patch:
 *    summary: actualizar un adiestrador
 *    security:
 *      - bearerAuth: []
 *    description: El adiestrador se actualizará con los campos incluidos en el responseBody
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
 *            $ref: "#/components/schemas/Adiestrador"
 *    responses:
 *      200:
 *        description: "Adiestrador actualizado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Adiestrador'
 *      404:
 *        $ref: '#/components/responses/ElementNotFoundError'
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.patch('/:idAdiestrador', isAuthenticated, adiestradorController.update);

/**
 * @swagger
 * /adiestradores/{idAdiestrador}/rating:
 *  get:
 *    summary: obtener el rating medio del adiestrador
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
 *        description: "Rating procesado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                score:
 *                  type: number
 *                  description: el rating medio del adiestrador
 *      404:
 *        $ref: '#/components/responses/ElementNotFoundError'
 */
router.get('/:idAdiestrador/rating', adiestradorController.getRating);

/**
 * @swagger
 * /adiestradores/{idAdiestrador}/rating:
 *  patch:
 *    summary: evaluar a un adiestrados
 *    security:
 *      - bearerAuth: []
 *    description: El rating se añadira a la lista de ratings del adiestrador
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
 *            properties:
 *              idCliente:
 *                type: string
 *                description: el id del cliente que ha realizado el rating
 *              score:
 *                type: number
 *                description: el valor del rating
 *    responses:
 *      200:
 *        description: "Rating procesado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                score:
 *                  type: number
 *                  description: el rating medio del adiestrador
 *      404:
 *        $ref: '#/components/responses/ElementNotFoundError'
 *      409:
 *        $ref: '#/components/responses/DuplicateEntryError'
 *      422:
 *        $ref: '#/components/responses/InvalidEntryError'
 */
router.patch(
  '/:idAdiestrador/rating',
  isAuthenticated,
  adiestradorController.rate
);

module.exports = router;
