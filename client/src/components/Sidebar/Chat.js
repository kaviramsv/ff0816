import React, { useCallback, useEffect, useState } from 'react';
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

const Chat = ({ conversation, setActiveChat, activeConversation, user }) => {
  const classes = useStyles();
  const { otherUser } = conversation;

  const totalUnreadCount = useCallback((messages) => {
    let count = 0;
    messages.forEach(msg => {
      if (msg.hasRead === "false" && msg.senderId === otherUser.id) {
        count++;
      }
    });
    return count;
  }, [otherUser.id] );
  const [count, setCount] = useState(() => {
    let totalUnread = totalUnreadCount(conversation.messages);
    return totalUnread;
  });

  //const updateMessage calling axios request in api messages in Home.js
  const updateMessages = async (body) => {    
    const { data } = await axios.put('/api/messages', body);    
    return data;
  };

  const findId = useCallback((messages) => {
    for (const msg of messages) {      
      if (msg.hasRead === "false" && msg.senderId === otherUser.id) {        
        return ({ "id": msg.conversationId, "senderId": msg.senderId })
      }
    }
  },[otherUser.id])

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
    let body = findId(conversation.messages);    
    if (body && body.id) {
      let updated = await updateMessages(body);
      console.log("updated", updated);
    }
    for (const msg of conversation.messages) {
      if (msg.hasRead === "false" && msg.senderId === otherUser.id) {
        msg.hasRead = "true";
      }
      ;//postn emit
      setCount(0);
    };
  }

  useEffect(() => {
    let totalUnread = totalUnreadCount(conversation.messages);
    const fetchData = async (body) => {
      const data = await updateMessages(body);
      return data;
    }
    const update = async () => {
      if (activeConversation === conversation.otherUser.username) {
        let body = findId(conversation.messages);
        if (body && body.id) {
          await fetchData(body);
          for (const msg of conversation.messages) {
            if (msg.hasRead === "false" && msg.senderId === otherUser.id) {
              msg.hasRead = "true";
            }
            ;//postn emit
            setCount(0);
          };
        }
      } else {
        setCount(totalUnread);
      }
    }
    update();
  }, [activeConversation, conversation, findId, otherUser.id, totalUnreadCount]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} totalRead={count} activeConversation={activeConversation} user={user} />
    </Box>
  );
};

export default Chat;
