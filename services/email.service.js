// import 3rd party modules

// import internal modules
const { sgm } = require('../util/email.config');
const userService = require('../services/user.service');

exports.sendEmail = async (
  emisor,
  destinatario,
  asunto,
  mensaje,
  blindCopies,
  isBroadcast
) => {
  if (!asunto || !mensaje || !destinatario) {
    const error = new Error(
      'El asunto, mensaje y destinatario son obligatorios'
    );
    error.httpStatus = 422;
    throw error;
  }

  const to = isBroadcast
    ? destinatario
    : await userService.findById(destinatario.userId);
  const from = await userService.findById(emisor.userId);
  const bcc = blindCopies || undefined;
  const email = {
    to: to.email,
    bcc: bcc,
    from: from.username + '@dogginer.com',
    subject: asunto,
    html: `${mensaje}<br> <p>Mensaje enviado por el usuario ${from.username} de Dogginer</p>`
  };
  console.log('email', email);
  sgm.send(email);
};

exports.sendPwdResetEmail = (user) => {
  const email = {
    to: user.email,
    subject: 'Password reset solicitad',
    html: `<h1>Has solicitado resetear tu password</h1>
    <p>Haz click <a href="http:/localhost:3000/users/${user.id}/resetPassword/${user.tempResetToken}" target="_blank">aqu&iacute;</a> para continuar.</p>
    <p>Este link tiene una validez de 60 minutos</p>`
  };
  sgm.send({
    ...email,
    from: 'hannah.fromSpain@gmail.com'
  });
};
