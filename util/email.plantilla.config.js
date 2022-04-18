// import 3rd party modules
const sgm = require('@sendgrid/mail');

const SENDGRIDAPIKEY = '<tu-api-key>';

sgm.setApiKey(SENDGRIDAPIKEY);
module.exports = { sgm };
