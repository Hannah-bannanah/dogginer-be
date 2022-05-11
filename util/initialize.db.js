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
const nombres = [
  'Ned Flanders',
  'Lisa Simpson',
  'Milhouse Van Houten',
  'Edna Krabappel',
  'Sideshow Bob',
  'Patty Bouvier',
  'Kent Brockman',
  'Helen Lovejoy',
  'Hans Moleman',
  'Agnes Skinner'
];
const TAGS = ['Agility', 'Cachorros', 'Razas grandes', 'Pastoreo'];

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
  const godPwd = await bcrypt.hash('God12345', 12);
  const userGod = new User({
    email: 'admin@dogginer.com',
    username: 'GOD',
    password: godPwd,
    role: 'GOD'
  });
  userGod.save();
  const pwd = await bcrypt.hash('Test1234', 12);
  for (let i = 1; i < 11; i++) {
    const userCliente = new User({
      email: `cliente${i}@dogginer.com`,
      username: `cliente${i}`,
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
      email: `adiestrador${i}@dogginer.com`,
      username: `adiestrador${i}`,
      password: pwd,
      role: 'ADIESTRADOR'
    });
    users.push(userAdiestrador);
    const adiestrador = new Adiestrador({
      userId: userAdiestrador,
      nombre: nombres[i - 1],
      imageUrl: `https://picsum.photos/id/${i * 10}/300`,
      bio: `Me gustan los paseos por la playa`,
      tags: [
        TAGS[Math.floor(Math.random() * 4)],
        TAGS[Math.floor(Math.random() * 4)]
      ]
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
      nombre: `Evento${i} privado`,
      descripcion: `Este es un evento privado activo`,
      fecha: `2022-06-${i}`,
      imageUrl: `https://picsum.photos/id/${i * 12}/300`,
      maxAforo: 10
    });
    const evento2 = new Evento({
      idAdiestrador: adiestrador._id,
      nombre: `Evento${i} publico`,
      descripcion: `Este es un evento publico activo`,
      fecha: `2022-07-${i}`,
      imageUrl: `https://picsum.photos/id/${i * 13}/300`,
      maxAforo: 10
    });
    const evento3 = new Evento({
      idAdiestrador: adiestrador._id,
      nombre: `Evento${i} terminado`,
      descripcion: `Este es un evento público terminado`,
      imageUrl: `https://picsum.photos/id/${i * 14}/300`,
      fecha: `2021-07-${i}`,
      maxAforo: 10
    });
    await evento1.save();
    await evento2.save();
    await evento3.save();
    evento1.invitados.push(clientes[5 - i]);
    await evento1.save();
    adiestrador.eventos.push(evento1, evento2, evento3);
    eventos.push(evento1, evento2, evento3);
    await adiestrador.save();
  }
  console.log('eventos demo cargados con exito');
};

const registrarClientes = async () => {
  for (const cliente of clientes) {
    const i = clientes.indexOf(cliente);
    cliente.eventos.push(
      eventos[(9 - i) * 3],
      eventos[i * 3 + 1],
      eventos[i * 3 + 2]
    );
    await cliente.save();
    const adiestrador1 = adiestradores[i];
    const adiestrador2 = adiestradores[9 - i];
    adiestrador1._ratings.push({
      idCliente: cliente,
      score: Math.floor(Math.random() * 5) + 1
    });
    adiestrador2._ratings.push({
      idCliente: cliente,
      score: Math.floor(Math.random() * 5) + 1
    });
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
