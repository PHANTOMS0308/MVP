import React, { useState, useEffect } from 'react';
import { useSocket, getDataByType, sendDataByType } from '../utils/socket.jsx';

export default function GameLeaderBoard() {
  const [userInfos, setUserInfos] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    function updateUserInfos(event) {
      const content = getDataByType('score', event);
      
      if (content) {
        // sort it by score
        console.log(content);
        content.sort((a, b) => b.score - a.score);
        setUserInfos(content);
      }
    }

    socket.addEventListener('message', updateUserInfos);
    sendDataByType('score', {});

    return () => socket.removeEventListener('message', updateUserInfos);
  }, []);

  return (
    <section className='game__leader-board'>
      { 
        userInfos.map(userInfo => {
          const { id, userName, score } = userInfo;
          return (
            <div key={ id } className='game__leader-board__card'>
              <p>User: { userName }</p>
              <p>Score: { score }</p>
            </div>
          );
        })
      }
    </section>
  );
}
