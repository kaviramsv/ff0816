import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import TypingBubble from './TypingBubble';
import moment from 'moment';
import { SocketContext } from '../../context/socket';


const Messages = (props) => {
  const { messages, otherUser, userId, activeConversation } = props;
  const [typing, setTyping] = useState(null);

  const socket = useContext(SocketContext);
  const findLast = (messages) => {
    let last = null;
    for (const msg of messages) {
      if (msg.senderId === userId && msg.hasRead === 'true') {
        last = msg.id;
      }
    }
    return last;
  };

  const [read, setRead] = useState(findLast(messages));
  const addTyping = useCallback((data) => {
    if (data.recipientId === userId && data.senderId === otherUser.id && data.activeConversation === activeConversation) {
      setTyping("Typing");
    }
  }, [activeConversation, otherUser.id, userId]);
  const stopTyping = useCallback((data) => {
    if (data.recipientId === userId && data.senderId === otherUser.id && data.activeConversation === activeConversation) {
      setTyping("stopped");
    }
  }, [activeConversation, otherUser.id, userId]);
  const addDeliveryBadge = useCallback((data) => {
    setRead(data.msgId);
  }, []);

  useEffect(() => {
    // Socket init
    socket.on("typing-success", addTyping);
    socket.on("stop", stopTyping);
    socket.on("delivered-success", addDeliveryBadge);
    return () => {
      socket.off("typing-success", addTyping);
      socket.off("stop", stopTyping);
      socket.off("delivered-success", addDeliveryBadge);
    };
  }, [addDeliveryBadge, addTyping, socket, stopTyping]);
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            badge={message.id === read}
            otherUser={otherUser} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
      {(typing === "Typing") ? <TypingBubble otherUser={otherUser} text="⚪ ⚪ ⚪" /> : null}
    </Box>
  );
};

export default Messages;
