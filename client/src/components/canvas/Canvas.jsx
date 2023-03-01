import React, { useRef, useEffect, useState } from 'react';

export default function Canvas({ isDrawer }) {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const pointerCoords = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://18.234.227.212:8080');
    }
    
    const socket = socketRef.current;

    socket.onopen = function(event) {
      console.log('connection opened');
    }

    socket.onmessage = function(event) {
      console.log('received message');

      const data = JSON.parse(event.data);
      draw(data);
    }

    socket.onclose = function(event) {
      console.log('connection closed');
    }

    socket.onerror = function(error) {
      console.log(error);
    }

    return () => {
      socket.close();
    }
  }, []);
  

  // This function will draw on the canvas based on socket data
  function draw(data) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(data.x1, data.y1);
    ctx.lineTo(data.x2, data.y2);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.lineWidth;
    ctx.lineCap = data.lineCap;
    ctx.stroke();
  }

  function pointerMove(event) {
    const data = pointerCoords.current;

    data.x2 = event.offsetX;
    data.y2 = event.offsetY;
    data.color = 'orange';
    data.lineWidth = 5;
    data.lineCap = 'round';

    draw(data);

    socketRef.current.send(JSON.stringify(pointerCoords.current));
    [data.x1, data.y1] = [data.x2, data.y2];
  }

  function pointerDown(event) {
    pointerCoords.current = { x1: event.offsetX, y1: event.offsetY };

    window.addEventListener('pointermove', pointerMove);

    canvasRef.current.onpointerup = (event) => {
      // canvasRef.current.getContext('2d').closePath();
      window.removeEventListener('pointermove', pointerMove);
      canvasRef.current.onpointerup = null;
    }
  }


  return (
    <canvas width='1000' height='1000' ref={ canvasRef } onPointerDown={ isDrawer ? pointerDown : null }>
      Canvas is not supported
    </canvas>
  );
}
