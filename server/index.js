const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 8080 });
const playerInfos = new Map;
const playerLimit = 3;

function broadcastData(type, content, notSendTo=null) {
  wss.clients.forEach(client => {
    if (client !== notSendTo && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, content }));
    }
  });
}

let gameRound = 0;

wss.on('connection', function connection(ws, req) {
  ws.on('error', console.error);
 
  // No connection allowed when clients number exceed 3
  if (wss.clients.size > playerLimit) {
    console.log('Reject connection because players exceed 3');
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
        console.log(playerInfos); // console.log
        break;
      case 'load':
        broadcastData('load', { playerCount: wss.clients.size });
        break;
      case 'score': 
        if (content.id) {
          const { id, addScore } = content;
          playerInfos.get(id).score += Number(addScore);
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
      case 'round': 
        
    }
  }); 
});



