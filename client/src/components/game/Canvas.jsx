import React, { useRef, useState, useEffect } from 'react';
import { useSocket, getDataByType, sendDataByType } from '../utils/socket.jsx';

export default function Canvas({ strokeWidth, strokeColor, isWriter }) {
  const canvasRef = useRef(null);
  const pointerCoords = useRef(null);
  const socket = useSocket();

  // For non-drawing canvas, update the canvas when receiving socket data
  useEffect(() => {
    function updateCanvas(event) {
      const content = getDataByType('canvas', event);

      if (!content) return;

      if (content.clearAll) clearAll();
      else draw(content);
    }

    socket.addEventListener('message', updateCanvas);

    return () => socket.removeEventListener('message', updateCanvas);
  }, []);

  // Set the height and width same as the physical width and hegith
  // Naive solution, not flexible design
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
  }, []);

  // This function will wipe out everything in the canvas
  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // This function will draw on the canvas based on socket data
  function draw(content) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(content.x1, content.y1);
    ctx.lineTo(content.x2, content.y2);
    ctx.strokeStyle = content.strokeColor;
    ctx.lineWidth = content.strokeWidth;
    ctx.lineCap = content.lineCap;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  function pointerMove(event) {
    const content = pointerCoords.current;

    content.x2 = event.offsetX;
    content.y2 = event.offsetY;
    content.strokeColor = strokeColor;
    content.strokeWidth = strokeWidth;
    content.lineCap = 'round';

    draw(content);
    sendDataByType('canvas', content);
    [content.x1, content.y1] = [content.x2, content.y2];
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
    <canvas ref={ canvasRef } onPointerDown={ isWriter ? pointerDown : null }>
      Canvas is not supported
    </canvas>
  );
}
