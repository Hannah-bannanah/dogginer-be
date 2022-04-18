// import 3rd party modules

// import internal modules
const { sgm } = require('../util/email.config');

exports.sendEmail = (emailData) => {
  sgm.send({
    ...emailData,
    from: 'hannah.fromspain@gmail.com'
  });
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
