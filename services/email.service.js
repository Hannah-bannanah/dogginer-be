// import 3rd party modules

// import internal modules
const { sgm } = require('../util/email.config');
const userService = require('../services/user.service');

exports.sendPrivateEmail = async (emisor, destinatario, asunto, mensaje) => {
  if (!asunto || !mensaje) {
    const error = new Error('El asunto y el mensaje son obligatorios');
    error.httpStatus = 422;
    throw error;
  }
  // // verificamos que el cliente está relacionado con el adiestrador
  // const interseccion = emisor.eventos.find((eventoCliente) => {
  //   const resultado = destinatario.eventos.find((eventoAdiestrador) =>
  //     eventoAdiestrador.equals(eventoCliente)
  //   );
  //   return !!resultado;
  // });
  // if (!interseccion) {
  //   const error = new Error('Operacion no autorizada');
  //   error.httpStatus = 403;
  //   throw error;
  // }

  const to = await userService.findById(destinatario.userId);
  const from = await userService.findById(emisor.userId);
  console.log('to', to);
  console.log('from', from);
  const email = {
    to: to.email,
    from: from.email,
    subject: asunto,
    html: `${mensaje}<br> <p>Mensaje enviado por el usuario ${to.username} de Dogginer</p>`
  };
  this.sendEmail(email);
};
exports.sendEmail = (emailData) => {
  sgm.send({
    ...emailData,
    from: 'hannah.fromspain@gmail.com'
  });
  console.log('email sent', emailData);
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
