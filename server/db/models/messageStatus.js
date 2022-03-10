const Sequelize = require("sequelize");
const db = require("../db");

const MessageStatus = db.define("message_status", {
  hasRead: {
    type: Sequelize.STRING,    
  }
});

module.exports = Group;