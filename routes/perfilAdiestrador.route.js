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
 *  post:
 *    summary: crear un perfil de adiestrador
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
 *            $ref: "#/components/schemas/Perfil"
 *    responses:
 *      200:
 *        description: "Perfil creado con exito"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  description: idPerfil
 *                  type: string
 *      400:
 *        description: "El adiestrador ya tiene perfil"
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
router.post('', adiestradorController.createPerfil);

/**
 * @swagger
 * /adiestradores/{idAdiestrador}/perfil:
 *  delete:
 *    summary: eliminar el perfil publico de adiestrador
 *    parameters:
 *      - in: path
 *        name: "idAdiestrador"
 *        description: el id del adiestrador
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      204:
 *        description: "Pefil eliminado con exito"
 */
router.delete('', adiestradorController.deletePerfil);

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
router.patch('', (req, res, next) => {
  console.log(req.params);
});

module.exports = router;
