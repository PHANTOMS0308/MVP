import React, { useState, useEffect, useRef } from 'react';
import { useSocket, sendDataByType, getDataByType } from '../utils/socket.jsx';

export default function GameChat({ userName }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const textBoxRef = useRef(null);
  const socket = useSocket();
  
  useEffect(() => {
    function updateChatMessages(event) {
      const content = getDataByType('chat', event);
     
      if (content) {
        console.log(chatMessages, content);
        setChatMessages([ ...chatMessages, content ]);
        setTimeout(() => {
          textBoxRef.current.querySelector('p:last-child').scrollIntoView(false);
        }, 500);
      }
    }

    socket.addEventListener('message', updateChatMessages);

    return () => socket.removeEventListener('message', updateChatMessages);
  }, [chatMessages]);

  const inputProps = {
    placeholder: 'Press Ctrl + Enter to Send Message...',
    value: inputMessage,
    onChange: onInputMessageChange,
    onKeyDown(event) {
      if (event.code === 'Enter' && (event.ctrlKey || event.metaKey)) {
        sendDataByType('chat', { user: userName, message: inputMessage });
        console.log(chatMessages);
        setInputMessage('');
      }
    }
  }

  function onInputMessageChange(event) {
    setInputMessage(event.target.value);
  }

  function onSubmitMessage(event) {
    event.preventDefault();
    sendDataByType('chat', { user: userName, message: inputMessage });
  }

  return (
    <section className='game__chat'>
      <div ref={ textBoxRef }>
        { 
          chatMessages.map(({ user, message }, index) => {
            return (
              <p key={ index }>{ user } : { message }</p>
            );
          })
        }
      </div>
      <textarea { ...inputProps }>
      </textarea>
    </section>
  );
}
