import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SocketContext } from '../../context/socket';
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1, 
  },
  division: {   
    display: "flex",
    direction: "column",
    flexGrow: 1, 
    justifyContent: "space-between",
    lineHeight:2,
    padding: 12,
  },
  
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
    
  },
  readBubble: {
    height: 25,
    background: '#3F92FF',
    borderRadius: 25,    
    minWidth:25,
    color: 'white',
    fontSize: "14px",
    verticalAlign: "center",    
    fontWeight: 700,
    padding:8,
    lineHeight:.8,    
  }

}));

const ChatContent = ({ conversation, totalRead, activeConversation, user }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  const [typing, setTyping] = useState(null);
  const socket = useContext(SocketContext);

  const addTyping = useCallback((data) => {    // 
    if (data.recipientId === user.id && data.senderId === otherUser.id) {
      setTyping("Typing");
    }
  }, [activeConversation]);
  const stopTyping = useCallback((data) => {
    if (data.recipientId === user.id && data.senderId === otherUser.id) {
      setTyping("stopped");
    }

  }, [activeConversation]);
  useEffect(() => {
    // Socket init
    socket.on("typing-success", addTyping);
    socket.on("stop", stopTyping);
    return () => {
      socket.off("typing-success", addTyping);
      socket.off("stop", stopTyping);
    };
  }, [addTyping, socket, stopTyping]);

  return (
    <Box className={classes.root}>
      <Box className={classes.division}>
        <Box className={classes.info}>
          <Typography className={classes.username}>
            {otherUser.username}
          </Typography>
          <Typography className={classes.previewText}>
            {typing === "Typing" ? <i>Typing....</i>: latestMessageText}
          </Typography>
        </Box>
        <Box className={classes.count}>
          {totalRead>0 &&
          <Typography className={classes.readBubble}>
            {totalRead }
          </Typography>}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatContent;
