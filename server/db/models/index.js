const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const MessageStatus = require("./messageStatus");
//User group associations

User.belongsToMany(Group,{through:"user_group",as:"group",foreignKey: "user_id"});
Group.belongsToMany(User,{through:"user_group",as:"user",foreignKey: "group_id"});

//Message and  group associations
Message.belongsTo(Group);
Group.hasMany(Message);
Message.belongsTo(User, { as: "sender" });

Message.hasOne(MessageStatus);
MessageStatus.belongsTo(Message, {as:"msg_id"});
MessageStatus.belongsTo(User, {as:"otherUser_id"});

module.exports = {
  User,
  Message,
  Group,
  MessageStatus
};
