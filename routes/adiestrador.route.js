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

// swagger schema Adiestrador
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
 *         imageUrl:
 *           type: string
 *           description: link a la foto del adiestrador
 *         eventos:
 *           type: array
 *           items:
 *            type: object
 *            $ref: '#/components/schemas/Evento'
 *         rating:
 *           type: number
 *           description: la media de los ratings por parte de los clientes (entre 0 y 5)
 *       required:
 *        - userId
 *        - nombre
 *       example:
 *         userId: "6249701119292623c38f0c11"
 *         nombre: "John Doe"
 *         bio: "El mejor adiestrador de la zona"
 *         imageUrl: "https://picsum.photos/id/237/300"
 *         rating: 3
 */

// define routes

// get all
/**
 * @swagger
 * /adiestradores:
 *  get:
 *    summary: obtener lista de adiestradores
 *    tags:
 *      - adiestradores
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
 *    description: crea un nuevo adiestrador. No es posible crear la lista de eventos del adiestrador
 *    tags:
 *      - adiestradores
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

// find by id
/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *   get:
 *    summary: buscar un adiestrador por id
 *    tags:
 *      - adiestradores
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
router.get('/:idAdiestrador', adiestradorController.findById);

// delete by id
/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  delete:
 *    summary: eliminar un adiestrador
 *    description: Elimina un adiestrador de la BD. Esta accion solo esta permitida a
 *                 administradores y el propio adiestrador. El adiestrador no debe tener
 *                 eventos activos.
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
 *      204:
 *        description: "adiestrador eliminado con exito"
 */
router.delete(
  '/:idAdiestrador',
  isAuthenticated,
  adiestradorController.deleteById
);

// update
/**
 * @swagger
 * /adiestradores/{idAdiestrador}:
 *  patch:
 *    summary: actualizar un adiestrador
 *    description: tan solo el adiestrador o un administrador podrán actualizar la información.
 *                 No se podrán actualizar mediante este end point la lista de eventos ni el rating del adiestrador.
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

// rate
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/rating:
 *  patch:
 *    summary: evaluar a un adiestrador
 *    description: Solo clientes registrados en eventos asociados al adieastrador podrán enviar un rating.
 *                 El rating añadirá a la lista de ratings de adiestrador una entrada para el cliente y el score
 *                 enviado. En caso de que el cliente ya haya evaluado al adiestrador, se sustituirá el valor
 *                 previo por el nuevo.
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
 *            properties:
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
