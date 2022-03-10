const Sequelize = require("sequelize");
const db = require("../db");

const Group = db.define("group", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }, 
  owner: {
    type: Sequelize.STRING,
    allowNull: false,
  }  
});

module.exports = Group;