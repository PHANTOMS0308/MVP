import React, { useState, useEffect } from 'react';
import Canvas from './Canvas.jsx';

export default function GameCanvasReader() {
  return (
    < >
      <Canvas isWriter={ false } />
      <div></div>
    </>
  )
}
