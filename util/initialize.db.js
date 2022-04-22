// import 3rd party modules
const bcrypt = require('bcrypt');

// import internal modules
const User = require('../models/user.model');
const Cliente = require('../models/cliente.model');
const Adiestrador = require('../models/adiestrador.model');
const Evento = require('../models/evento.model');

const users = [];
const clientes = [];
const adiestradores = [];
const eventos = [];

const emptyDb = async () => {
  await Evento.deleteMany({});
  console.log('borrado datos de Eventos');
  await Cliente.deleteMany({});
  console.log('borrado datos de Clientes');
  await Adiestrador.deleteMany({});
  console.log('borrado datos de Adiestradors');
  await User.deleteMany({});
  console.log('borrado datos de Users');
};

const createUsers = async () => {
  const godPwd = await bcrypt.hash('GOD', 12);
  const userGod = new User({
    email: 'admin@admin.com',
    password: godPwd,
    role: 'GOD'
  });
  userGod.save();
  const pwd = await bcrypt.hash('test1234', 12);
  for (let i = 1; i < 6; i++) {
    const userCliente = new User({
      email: `cliente${i}@cliente.com`,
      password: pwd,
      role: 'CLIENTE'
    });
    users.push(userCliente);
    const cliente = new Cliente({
      userId: userCliente,
      nombre: `cliente${i}`
    });
    clientes.push(cliente);
    const userAdiestrador = new User({
      email: `adiestrador${i}@adiestrador.com`,
      password: pwd,
      role: 'ADIESTRADOR'
    });
    users.push(userAdiestrador);
    const adiestrador = new Adiestrador({
      userId: userAdiestrador,
      nombre: `adiestrador${i}`,
      bio: `Me gustan los paseos por la playa`
    });
    adiestradores.push(adiestrador);
  }
  await User.bulkSave(users);
  console.log('usurios demo cargados con exito');
  await Adiestrador.bulkSave(adiestradores);
  console.log('adiestradores demo cargados con exito');
  await Cliente.bulkSave(clientes);
  console.log('clientes demo cargados con exito');
};

const createEventos = async () => {
  for (const adiestrador of adiestradores) {
    const i = adiestradores.indexOf(adiestrador) + 1;
    const evento1 = new Evento({
      idAdiestrador: adiestrador._id,
      nombre: `Evento${i}`,
      fecha: `2022-06-${i}`,
      maxAforo: 10
    });
    const evento2 = new Evento({
      idAdiestrador: adiestrador._id,
      nombre: `Evento${i} privado`,
      fecha: `2022-07-${i}`,
      maxAforo: 10
    });
    const evento3 = new Evento({
      idAdiestrador: adiestrador._id,
      nombre: `Evento${i} terminado`,
      fecha: `2021-07-${i}`,
      maxAforo: 10
    });
    await evento1.save();
    await evento2.save();
    await evento3.save();
    evento2.invitados.push(clientes[5 - i]);
    await evento2.save();
    adiestrador.eventos.push(evento1, evento2);
    eventos.push(evento1, evento2);
    await adiestrador.save();
  }
  console.log('eventos demo cargados con exito');
};

const registrarClientes = async () => {
  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    cliente.eventos.push(eventos[i], eventos[i + 1], eventos[i + 3]);
    await cliente.save();
    const adiestrador1 = adiestradores[i];
    const adiestrador2 = adiestradores[4 - i];
    adiestrador1._ratings.push({ idCliente: cliente, score: i });
    adiestrador2._ratings.push({ idCliente: cliente, score: i });
    await adiestrador1.save();
    await adiestrador2.save();
  }
};

const initializeDb = async () => {
  await emptyDb();
  await createUsers();
  await createEventos();
  await registrarClientes();
  console.log('bbdd inicializada con demo data');
};

module.exports = { initializeDb };
