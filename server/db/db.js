const Sequelize = require("sequelize");

// const db = new Sequelize(process.env.DATABASE_URL || "postgres://localhost:5432/pi", {
//   logging: false
// });
const db = new Sequelize('pi', 'postgres', 'a', {
  host: 'localhost',
  dialect: 'postgres'
});
module.exports = db;
