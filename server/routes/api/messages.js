const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender, hasRead } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId, hasRead });
      return res.json({ message, sender, hasRead });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      hasRead: false,
    });
    res.json({ message, sender, hasRead });
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { id, senderId } = req.body;
    const conversationUser = await Conversation.findAll({
      where: { id: id },
      raw: true,
    })    
    const owners = [];
    owners.push(conversationUser[0].user1Id);
    owners.push(conversationUser[0].user2Id);

    if  (!owners.includes(req.user.id)){
      return res.sendStatus(403);
    }
    const updatedMessage = await Message.update(
      { hasRead: "true" },
      { where: { conversationId: id, senderId: senderId } } ,
    );

    const latestUpdated = await Message.max(
      'id', {
      where: { conversationId: id, senderId: senderId }
    });
    res.json({ id, latestUpdated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
