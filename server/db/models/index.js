const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1",foreignKey: {
  allowNull: true
} });
Conversation.belongsTo(User, { as: "user2" ,foreignKey: {
  allowNull: true
}});
Conversation.belongsTo(Group, { as: "group" ,foreignKey: {
  allowNull: true,
} });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
User.belongsToMany(Group,{through:"user_group",as:"group",foreignKey: "user_id"});
Group.belongsToMany(User,{through:"user_group",as:"user",foreignKey: "group_id"});

module.exports = {
  User,
  Conversation,
  Message,
  Group
};
