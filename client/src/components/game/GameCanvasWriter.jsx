import React, { useRef, useEffect, useState } from 'react';
import { useSocket, getDataByType, sendDataByType } from '../utils/socket.jsx';
import Canvas from './Canvas.jsx';
import Timer from './Timer.jsx';

export default function GameCanvasWriter({ word, roundFinished }) {
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState('white');

  // 6 color options
  const colors = ['white', 'tomato', 'mediumseagreen', 'orange', 'dodgerblue','violet'];
  const colorElems = colors.map(color => {
    const prop = {
      className: color === strokeColor ? 'game__toolbar__color--chosen' : null,
      key: color,
      style: { backgroundColor: color },
      onClick: () => setStrokeColor(color)
    };

    return <div { ...prop }></div>;
  });
  const colorPicker = <div className='game__toolbar__color'>{ colorElems }</div>;

  // 3 width options
  const widths = [3, 6, 9];
  const widthElems = widths.map(width => {
    const prop = {
      className: width === strokeWidth ? 'game__toolbar__width--chosen': null,
      key: width,
      style: { backgroundColor: strokeColor === '#292a2d' ? 'white' : strokeColor },
      onClick: () => setStrokeWidth(width)
    };
    
    return <div { ...prop }></div>
  });
  const widthPicker = <div className='game__toolbar__width'>{ widthElems }</div>;

  // 2 delete options, one erasor, one clear the whole canvas
  // The erasor right now is simply change color to the background
  // Which is kinda a naive solution, subject to refactor later
  const erasorOption = (
    <svg viewBox="0 0 150 150"  onClick={ () => { setStrokeColor('#292a2d'); } }>
      <rect 
        x="59.4109" y="133.782" width="52.0001" height="102" rx="8" 
        transform="rotate(-139.461 59.4109 133.782)" fill="#FC6A00" 
        stroke="black" strokeWidth="3"
      />
      <path 
        d='M64.6106 127.703C61.7389 131.061 56.6889 131.454 53.3312 128.583L25.9726 105.184C22.6148 102.312 22.2209 97.262 25.0926 93.9043L38.3529 78.4001L77.8709 112.199L64.6106 127.703Z'        fill="#F6B73F" stroke="black" strokeWidth="3"
      />    
    </svg>
  );

  function clearAll(event) {
    const ans = confirm('Delete the whole drawing?');
    if (ans) sendDataByType('canvas', { clearAll: true } );
  }

  const clearOption = (
    <svg viewBox='0 0 100 100' onClick={ clearAll }>
      <line x1='10' y1='10' x2='90' y2='90' />
      <line x1='10' y1='90' x2='90' y2='10' />
    </svg>
  );

  const deletePicker = (
    <div className='game__toolbar__delete'>
      { erasorOption }
      { clearOption }
    </div>
  );

  const canvasProps = {
    strokeWidth,
    strokeColor,
    isWriter: true// isWriter: roundFinished ? false : true
  }

  return (
    < >
      <main className='game__canvas'>
        <span>The word is: { word }</span>
        <Canvas { ...canvasProps } />
      </main>
      <nav className='game__toolbar'>
        { colorPicker }
        { widthPicker }
        { deletePicker }
      </nav>
    </>
  );
}
