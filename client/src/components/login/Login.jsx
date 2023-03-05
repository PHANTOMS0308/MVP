import React, { useState } from 'react';
import { sendDataByType } from '../utils/socket.jsx';
import { redirect } from '../utils/router.jsx';

export default function Login({ userId, setUserName }) {
  function onSubmit(event) {
    event.preventDefault();
    const userName = document.forms[0].username.value;

    sendDataByType('login', { id: userId, userName });

    setUserName(userName);
    redirect(window.location.origin + '/load');    
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
