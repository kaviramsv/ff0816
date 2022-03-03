import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import { SocketContext } from '../../context/socket';


const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const [typing, setTyping] = useState(null);
  const socket = useContext(SocketContext);
  const addTyping = useCallback((data) => {
    console.log(messages,"message",otherUser, userId);
    if(data.recipientId===userId && data.senderId===otherUser.id){
    setTyping("Typing");
    }
  }, []);
  const stopTyping = useCallback((data) => {
    setTyping("stopped");
  }, []);
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
