import React, { createContext, useContext } from 'react';

const socket = new WebSocket('ws://44.206.231.106:8080');
const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={ socket }>
      { children }
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

// either null or content
export function getDataByType(type, event) {
  const data = JSON.parse(event.data);

  if (data.type === type) return data.content;
  else  return null; 
}

// send data and mark type
export function sendDataByType(type, content) {
  socket.send(JSON.stringify({ type, content }));
}
