import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FormControl, FilledInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../../context/socket';
import UserAvatar from '../Sidebar/BadgeAvatar';

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: 'flex-end',
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: '#F4F6FA',
    borderRadius: 8,
    marginBottom: 20,
  },
}));

const Input = ({ otherUser, conversationId, user, postMessage }) => {
  const classes = useStyles();
  const [text, setText] = useState('');
  const socket = useContext(SocketContext);
  
  const sendTyping = () => {
    console.log("in send typing Input",conversationId,otherUser.id,user.id);
    socket.emit("typing", {
      conversationId: conversationId,
      recipientId: otherUser.id,
      senderId: user.id,  
    });
  }
  const sendStoppedTyping = () => {
    console.log("in send stop typing Input",conversationId,otherUser.id,user.id);
    socket.emit("stop", {
      conversationId: conversationId,
      recipientId: otherUser.id,
      senderId: user.id,  
    });
  }
  const handleChange = (event) => {
    setText(event.target.value);    
    if (event.target.value==="") {      
      sendStoppedTyping();
    }else{
      sendTyping();
    }
  };
  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){      
      sendStoppedTyping();
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: formElements.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
      hasRead: "false",
    };
    await postMessage(reqBody);
    setText('');
  };
 

  // const addTyping = useCallback((data) => {
  //   console.log("data tying ",data);
  
  // }, []);
  // useEffect(() => {
  //   // Socket init
  //   socket.on("typing-success", addTyping);   

  //   return () => {    
  //     socket.off("typing-success", addTyping);      
  //   };
  // }, [addTyping, socket]);
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onKeyPress={handleKeyPress}
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

export default Input;
