/**
 * @swagger
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       description: Un evento
 *       properties:
 *         idAdiestrador:
 *           type: string
 *           description: el id del adiestrador creador del evento
 *         nombre:
 *           type: string
 *           description: el nombre del evento
 *         descripcion:
 *           type: string
 *           description: la descripcion del evento
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: la fecha en que tiene lugar el evento
 *         maxAforo:
 *           type: number
 *           descripcion: el aforo maximo del evento
 *         privado:
 *           type: boolean
 *           descripcion: indicador de si el evento es privado (omitir si no lo es)
 *         terminado:
 *           type: boolean
 *           descripcion: indicador de si el evento ha terminado (omitir si no es asi)
 *       required:
 *        - nombre
 *        - idAdiestrador
 *        - fecha
 *       example:
 *         nombre: "Sesion de adiestramiento"
 *         descripcion: "Adiestramiento de agility de Mora"
 *         idAdiestrador: "6249701119292623c38f0c11"
 *         fecha: "2017-07-21T17:32:28Z"
 *         maxAforo: 27,
 *         privado: true
 *
 */
