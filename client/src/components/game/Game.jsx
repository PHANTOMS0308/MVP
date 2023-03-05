import React, { useEffect, useState, useRef } from 'react';
import GameLeaderBoard from './GameLeaderBoard.jsx';
import GameChat from './GameChat.jsx';
import GameCanvasWriter from './GameCanvasWriter.jsx';
import GameCanvasReader from './GameCanvasReader.jsx';

export default function Game({ userId, userName, getNextPrompt }) {
  const [isWriter, setIsWriter] = useState(false);
  const word = getNextPrompt();

  return (
    <div className='game__container'>
      <GameLeaderBoard /> 
      <GameChat userName={ userName } />
      { if <GameCanvasWriter word={ word } />
      <GameCanvasReader word={ word } />
    </div>
  )

}
