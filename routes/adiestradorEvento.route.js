// import 3rd party modules
const express = require('express');

// import internal modules
const adiestradorController = require('../controllers/adiestrador.controller');

// initialize router
const router = express.Router({ mergeParams: true });

// get clientes
/**
 * @swagger
 * /adiestradores/{idAdiestrador}/eventos:
 *  get:
 *    summary: obtener lista de eventos del adiestrador
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
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Evento"
 */
router.get('', adiestradorController.fetchEventos);

module.exports = router;
