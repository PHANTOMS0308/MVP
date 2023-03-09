import React, { useState, useEffect } from 'react';
import { useSocket, getDataByType, sendDataByType } from '../utils/socket.jsx';
import { redirect } from '../utils/router.jsx';

export default function Load({ isHost }) {
  const [playerCount, setPlayerCount] = useState(1);
  const socket = useSocket();
  
  useEffect(() => {

    function updatePlayerCount(event) {
      const content = getDataByType('load', event);

      if (content) {
        setPlayerCount(content.playerCount);
      }
    }

    function startGame(event) {
      const content = getDataByType('start', event);

      if (content && content.start) {
        redirect(window.location.origin + '/game');
      }
    }

    socket.addEventListener('message', updatePlayerCount);
    socket.addEventListener('message', startGame);
    sendDataByType('load', {});

    return () => {
      socket.removeEventListener('message', updatePlayerCount);
      socket.removeEventListener('message', startGame);
    }
  }, []);

  return (
    <main className='load__container'>
      <p className={ `load__status--${ socket.readyState < 2 ? 'good' : 'bad' }` }>
        {
          socket.readyState < 2 
          ? `${playerCount} Players Joined...`
          : 'Sorry, the server is full...'
        }
      </p>
      { isHost ? <button onClick={ () => sendDataByType('start') }>START</button> : null }
    </main>
  );
}
