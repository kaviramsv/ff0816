import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

const Chat = ({ conversation, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  const totalUnreadCount = (messages) => {
    let count = 0;
    messages.forEach(msg => {
      if (msg.hasRead === "false" && msg.senderId === otherUser.id) {
        console.log("msg", msg)
        count++;
      }
    });
    return count;
  }
  const [count, setCount] = useState(() => {
    let totalUnread = totalUnreadCount(conversation.messages);
    return totalUnread;
  });

  //const updateMessage calling axios request in api messages in Home.js
  const updateMessages = async (id) => {
    console.log("in upd msgs", id)
    
    const { data } = await axios.put('/api/messages',{"id":id});
    console.log("data updated", data);
    return data;
  };

  const findId = (messages) => {
    
    for (const msg of messages) {
      console.log(msg);
      if (msg.hasRead === "false" && msg.senderId === otherUser.id) {
        return msg.conversationId;
      }
    }
    
  }

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);

    let convId = findId(conversation.messages);
    console.log("con ids",convId);
    let updated = await updateMessages(2);

    console.log("updated",updated);

    for (const msg of conversation.messages) {
      if (msg.hasRead === "false" && msg.senderId === otherUser.id) {
        msg.hasRead = "true";        
      }
      ;//postn emit
      setCount(0);
    };

  }
    return (
      <Box onClick={() => handleClick(conversation)} className={classes.root}>
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={conversation} totalRead={count} />
      </Box>
    );
  };

  export default Chat;
