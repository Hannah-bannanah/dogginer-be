// import 3rd party modules
const sgm = require('@sendgrid/mail');

sgm.setApiKey(process.env.SENDGRIDAPIKEY);
module.exports = { sgm };
