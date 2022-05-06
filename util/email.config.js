// import 3rd party modules
const sgm = require('@sendgrid/mail');

const FROMEMAIL = 'hannah.fromspain@gmail.com';
sgm.setApiKey(process.env.SENDGRIDAPIKEY);
module.exports = { sgm, FROMEMAIL };
