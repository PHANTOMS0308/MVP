import React, { useRef, useState, useEffect } from 'react';
import { sendDataByType } from '../utils/socket.jsx';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';

export default function GameCanvasReader({ writer, roundFinished, word, userId }) {
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setAnswerIsCorrect(false);
  }, [word]);


  const inputProps = {
    value: answer,
    placeholder: 'Press Ctrl + Enter to Submit the Answer...',
    onChange(e) { setAnswer(e.target.value); },
    onKeyDown(e) {
      if (e.code === 'Enter' && (e.ctrlKey || e.metaKey)) {
        if (answer.toLowerCase() === word.toLowerCase()) {
          sendDataByType('score', { id: userId, addScore: 2 });
          setAnswerIsCorrect(true);
        } else {
          alert('Your answer is wrong!'); // need to change this for better UX
        }
      }
    }
  };

  const correctStatement = `You are ${answerIsCorrect ? 'correct' : 'wrong'}!`;
  const answerStatement = `The correct answer is ${word}`;
  const message = <p>{ `${correctStatement} ${answerStatement}` }</p>;

  return (
    < >
      <main className='game__canvas'>
        <span>{ writer } is drawing</span>
        <Canvas isWriter={ false } />
      </main>
      <nav className='game__answerbar'>
        { 
          roundFinished || answerIsCorrect
          ? message 
          : <input { ...inputProps } /> 
        } 
      </nav>
    </>
  )
}
