import { CustomWebSocket, wss } from "../index";

const rooms: { [key: string]: Set<CustomWebSocket> } = {};

wss.on('connection', (ws: CustomWebSocket) => {
  ws.on('error', console.error);

  ws.on('message', (message) => {
    const { action, payload } = JSON.parse(message.toString());

    switch (action) {
      case 'joinRoom':
        const { roomId, userId } = payload;
        if (!rooms[roomId]) {
          rooms[roomId] = new Set();
        }
        rooms[roomId].add(ws);
        ws.roomId = roomId;
        ws.userId = userId;
        break;

      case 'typingSpeed':
        const { roomId: typingRomId, speed } = payload;
        if (rooms[typingRomId]) {
          rooms[typingRomId].forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ userId: ws.userId, speed }))
            }
          })
        }
        break;
    }
  })

  ws.on('close', () => {
    if (ws.roomId && rooms[ws.roomId]) {
      rooms[ws.roomId].delete(ws);
      if (rooms[ws.roomId].size === 0) {
        delete rooms[ws.roomId];
      }
    }
  })
})


