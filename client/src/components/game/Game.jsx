import React, { useEffect, useState, useRef } from 'react';
import GameLeaderBoard from './GameLeaderBoard.jsx';
import GameChat from './GameChat.jsx';
import GameCanvasWriter from './GameCanvasWriter.jsx';
import GameCanvasReader from './GameCanvasReader.jsx';
import { useSocket, getDataByType, sendDataByType } from '../utils/socket.jsx';
import Timer from './Timer.jsx';

export default function Game({ userId, userName }) {
  const [round, setRound] = useState(0);
  const [gameInfo, setGameInfo] = useState({ writer: null, word: null });
  const [roundFinished, setRoundFinished] = useState(false);
  const socket = useSocket();
  const { writer, writerName, word } = gameInfo;

  useEffect(() => {
    function updateGameInfo(event) {
      const content = getDataByType('game', event);
      
      if (content) {
        console.log(content, userId);
        setGameInfo(content);
      }
    }

    socket.addEventListener('message', updateGameInfo);
    sendDataByType('game', { round });

    // reset roundFinished every round
    setRoundFinished(false);

    return () => socket.removeEventListener('message', updateGameInfo);
  }, [round]);


  function nextRound() {
    setRound(round + 1);
  }

  return (
    <div className='game__container'>
      <GameLeaderBoard /> 
      <GameChat userName={ userName } />
      {
        writer === userId
        ? <GameCanvasWriter word={ word } roundFinished={ roundFinished } />
        : <GameCanvasReader word={ word } writer={ writerName } userId={ userId } roundFinished={ roundFinished } />
      }
      {
        roundFinished
        ? <Timer key='1' seconds={ 5 } message='Next Round Start in' callback={ nextRound } />
        : <Timer key='2' seconds={ 45 } callback={ () => setRoundFinished(true) } />
      }
    </div>
  );
  // You may not want to pass word to Reader, otherwise they might cheat
}
