import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import { SocketContext } from '../../context/socket';


const Messages = (props) => {
  const { messages, otherUser, userId , activeConversation} = props;
  const [typing, setTyping] = useState(null);
  const socket = useContext(SocketContext);
  console.log("act", activeConversation);
  const addTyping = useCallback((data) => {
    console.log("ACT INSIE CALL BACK",activeConversation,data.activeConversation );
    if(data.recipientId===userId && data.senderId===otherUser.id && data.activeConversation===activeConversation){
    setTyping("Typing");
    }
  }, [activeConversation]);
  const stopTyping = useCallback((data) => {
    if(data.recipientId===userId && data.senderId===otherUser.id && data.activeConversation===activeConversation){
    setTyping("stopped");
    }

  }, [activeConversation]);
  useEffect(() => {
    // Socket init
    socket.on("typing-success", addTyping);
    socket.on("stop", stopTyping);
    return () => {
      socket.off("typing-success", addTyping);
      socket.on("stop", stopTyping);
    };
  }, [addTyping, socket, stopTyping]);
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');
        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
      {(typing === "Typing") ? <OtherUserBubble otherUser={otherUser} time={""} text={typing} /> : null}
    </Box>
  );
};

export default Messages;
