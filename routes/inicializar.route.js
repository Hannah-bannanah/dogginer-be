// import 3rd party modules
const express = require('express');

// import internal modules
const { DBNAME } = require('../util/db.config');
const { initializeDb } = require('../util/initialize.db');

// initialize router
const router = express.Router();

// inicializar bbdd
/**
 * @swagger
 * /inicializar:
 *  post:
 *    summary: inicializar la bbdd con data demo para poder hacer pruebas
 *    tags:
 *      - DANGER ZONE
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              inicializar:
 *                type: boolean
 *              seguro:
 *                type: boolean
 *              dbname:
 *                type: string
 *                description: el nombre de la base de datos
 *            required:
 *              - inicializar
 *              - seguro
 *              - dbname
 *            example:
 *              inicializar: true
 *              seguro: true
 *              dbname: "el nombre exacto"
 *    responses:
 *      201:
 *        description: "bbdd inicializada con exito"
 */
router.post('', async (req, res, next) => {
  if (req.body.inicializar && req.body.seguro && req.body.dbname === DBNAME) {
    try {
      await initializeDb();
      res.status(201).send();
    } catch (err) {
      next(err);
    }
  } else {
    const error = new Error('Invalid body');
    error.httpStatus = 400;
    next(error);
  }
});

module.exports = router;
