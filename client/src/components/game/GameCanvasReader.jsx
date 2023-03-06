import React, { useRef, useState, useEffect } from 'react';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';

export default function GameCanvasReader({ roundFinished, word, userId }) {
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false);
  const [answer, setAnswer] = useState('');

  const inputProps = {
    value: answer,
    onChange(e) { setAnswer(e.target.value); },
    onKeyDown(e) {
      if (e.code === 'Enter' && (e.ctrlKey || e.metaKey)) {
        if (answer.toLowerCase() === word.toLowerCase()) setAnswerIsCorrect(true);
        else alert('Your answer is wrong!'); // need to change this for better UX
      }
    }
  };

  const correctStatement = `You are ${answerIsCorrect ? 'correct' : 'wrong'}!`;
  const answerStatement = `The correct answer is ${word}`;
  const messsage = <p>{ `${correctStatement} ${answerStatement}` }</p>;

  return (
    < >
      <Canvas isWriter={ false } />
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
