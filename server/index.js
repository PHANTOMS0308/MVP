const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
const playerInfos = new Map;
const playerLimit = 4;
let playerIds = [];

function broadcastData(type, content, notSendTo=null) {
  wss.clients.forEach(client => {
    if (client !== notSendTo && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, content }));
    }
  });
}

// This should be in the database, will be refactor later
const words = [
  'Strawberry', 'USA', 'Cowboy', 'Ketchup', 'Laptop',
  'God', 'Spiderman', 'JavaScript', 'Disney', 'Rapper'
];

let currentWord = null;
let currentWriter = null;

function nextRound(round) {
  const N = playerIds.length;
  currentWord = words[round];
  currentWriter = playerIds[round%N];
}

// this is a naive solution, when readyPlayers reach 3, we send out new round information
// so the clients know they should start a new game, and then we reset readyPlayers
let readyPlayers = 0;

wss.on('connection', function connection(ws, req) {
  ws.on('error', console.error);
 
  // No connection allowed when clients number exceed 3
  if (wss.clients.size > playerLimit) {
    console.log(`Reject connection because players exceed ${playerLimit}`);
    ws.close();
  }

  // Send player counts to client waiting for game
  broadcastData('load', { playerCount: wss.clients.size });

  // Handle different type of request
  ws.on('message', function message(data) {
    data = JSON.parse(data.toString());
    const { type, content } = data;

    switch (type) {
      case 'login':
        content.score = 0;
        playerInfos.set(content.id, content);
        playerIds = [...playerInfos.keys()];
        ws.send(JSON.stringify({ 
          type: 'login', 
          content: { isHost: playerInfos.size === 1 } 
        }));
        console.log(playerInfos, playerIds);
        break;
      case 'load':
        broadcastData('load', { playerCount: wss.clients.size });
        break;
      case 'score': 
        if (content.id) {
          const { id, addScore } = content;
          playerInfos.get(id).score += Number(addScore);
          playerInfos.get(currentWriter).score += 1; // drawer add one points for now
        }
        broadcastData('score', [...playerInfos.values()]);
        break;
      case 'chat':
        broadcastData('chat', content);
        break;
      case 'canvas':
        if (content.clearAll) broadcastData('canvas', content);
        else broadcastData('canvas', content, ws);        
        break;
      case 'start':
        broadcastData('start', { start: true });
        break;
      case 'game': 
        readyPlayers += 1;
        if (readyPlayers >= playerIds.length) {
          nextRound(content.round);
          broadcastData('canvas', JSON.stringify({ type: 'canvas', clearAll: true }));
          broadcastData('game', { 
            writer: currentWriter, 
            writerName: playerInfos.get(currentWriter).userName,
            currentWord 
          });
          readyPlayers = 0;
        }
        break;
    }
  }); 
});



