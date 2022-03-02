import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';

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
  const [count, setCount] = useState(conversation.messages.length);

  const totalReadCount = (messages) => {
    let count = 0;
    messages.forEach(msg => {
      if (msg.hasRead === "false") {
        count++ ;
      }      
    });
    return count;
  } 
  const totalMessageCount = messages => messages.length ;

  //const updateMessage calling axios request in api messages in Home.js
  //
  
  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
    console.log("conversation", conversation);
    console.log("conversation.otherUser.username", conversation.otherUser.username);
    let total = totalMessageCount(conversation.messages);  
    let totalRead = totalReadCount(conversation.messages);
    conversation.messages.forEach(msg=>{msg.hasRead="true"});//postn emit
    setCount(prev=> prev-totalRead);
  };


  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} totalRead={count}/>
    </Box>
  );
};

export default Chat;
