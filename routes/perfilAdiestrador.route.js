//import 3rd party modules
const express = require('express');

//import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');
//initialize router
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /adiestradores/{idAdiestrador}/perfil:
 *  get:
 *    summary: obtener el perfil de adiestrador
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
 *              $ref: "#/components/schemas/Perfil"
 *      404:
 *        description: "El adiestrador no existe o no tiene perfil publico"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  description: error
 *                  type: string
 */
router.get('', adiestradorController.getPerfil);

/**
 * @swagger
 * /adiestradores/{idAdiestrador}/perfil:
 *  patch:
 *    summary: actualizar el perfil publico del adiestrador
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
 *    responses:
 *      200:
 *        description: "Perfil actualizado con exito"
 *        constent:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: "#/components/schemas/Perfil"
 *      404:
 *        description: "El adiestrador no existe o no dispone de un perfil publico"
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
router.patch('', adiestradorController.updatePerfil);

module.exports = router;
