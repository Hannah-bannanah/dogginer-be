const DBCONNECTION = `mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PWD}@cluster0.y0t8i.mongodb.net/dogginer?retryWrites=true&w=majority`;

const DBNAME = 'dogginer';
module.exports = { DBCONNECTION, DBNAME };
