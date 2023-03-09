import React, { useState, useEffect } from 'react';
import { useSocket, getDataByType, sendDataByType } from '../utils/socket.jsx';
import { redirect } from '../utils/router.jsx';

export default function Login({ userId, setUserName, setIsHost }) {
  const socket = useSocket();

  useEffect(() => {
    function updateHost(event) {
      const content = getDataByType('login', event);

      if (content) {
        setIsHost(content.isHost);
      }
    }

    socket.addEventListener('message', updateHost);

    return () => socket.removeEventListener('message', updateHost);
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    const userName = document.forms[0].username.value;

    setUserName(userName);
    sendDataByType('login', { id: userId, userName });
    setTimeout(() => redirect(window.location.origin + '/load'), 1000);
  }

  const inputProps = {
    placeholder: 'Enter Your Username',
    autoFocus: true,
    name: 'username'
  }

  return (
    <main className='login__container'>
      <h1>Doodle & Guess</h1>
      <form onSubmit={ onSubmit }>
        <input { ...inputProps } />
      </form>
      <small>Beta Version (1.0.1)</small>
    </main>
  );
}
