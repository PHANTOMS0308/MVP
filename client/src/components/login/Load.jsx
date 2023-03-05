import React, { useState, useEffect } from 'react';
import { useSocket, getDataByType, sendDataByType } from '../utils/socket.jsx';
import { redirect } from '../utils/router.jsx';

const maxPlayerCount = 3;

export default function Load() {
  const [playerCount, setPlayerCount] = useState(1);
  const socket = useSocket();
  
  useEffect(() => {

    function updatePlayerCount(event) {
      const content = getDataByType('load', event);
      
      if (content) setPlayerCount(content.playerCount);
    }

    socket.addEventListener('message', updatePlayerCount);
    sendDataByType('load', {});

    return () => {
      socket.removeEventListener('message', updatePlayerCount);
    }
  }, []);

  useEffect(() => {
    if (playerCount >= maxPlayerCount) {
      redirect(window.location.origin +'/game');
    }
  }, [playerCount]);

  return (
    <main className='load__container'>
      <p className={ `load__status--${ socket.readyState < 2 ? 'good' : 'bad' }` }>
        {
          socket.readyState < 2 
          ? `${playerCount} Players Joined...`
          : 'Sorry, the server is full...'
        }
      </p>
    </main>
  );
}
