import React, { useEffect, useState } from 'react';
import Canvas from './canvas/Canvas.jsx';
import '../styles/index.scss';

export default function App() {
  const name = prompt('what is your name');

  return (
    < >
      <Canvas isDrawer={ name === 'Shen' }/>
    </>
  );
}
