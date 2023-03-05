import React, { useState, useId } from 'react';
import { Route } from './utils/router.jsx';
import { SocketProvider } from './utils/socket.jsx';
import Game from './game/Game.jsx';
import Login from './login/Login.jsx';
import Load from './login/Load.jsx';
import '../styles/index.scss';
import { v4 } from 'uuid';

const prompts = ['apple', 'laptop', 'amazon', 'google', 'javascript'];
let i = 0;

export default function App() {
  const userId = v4();
  const [userName, setUserName] = useState('');

  function getNextPrompt() {
    if (i >= prompts.length) return null;
    
    return prompts[i++];
  }

  return (
    <SocketProvider>
      <Route pathName='/'> 
        <Login { ...{ userId, setUserName } }/>
      </Route>
      <Route pathName='/load'>
        <Load />
      </Route>
      <Route pathName='/game'>
        <Game { ...{ userId, userName, getNextPrompt } } />
      </Route>  
    </SocketProvider>
  );
}
